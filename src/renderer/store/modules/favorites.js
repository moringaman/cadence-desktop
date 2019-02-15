import Firebase from '../../helpers/firebase';
import uid from '../../helpers/uid';
import safeName from '../../helpers/safeName'
import _ from 'lodash';
import http from 'http'
const path = require('path')
const find = require('find')
const fs = require('fs')
const Nucleus = require('electron-nucleus')('5c2fd2e8ffc1fb00ce9582e2')

const state = {
    favs: [],
    showFavs: false,
    recipientAddress: ''
}

const mutations = {
    loadFavs({
        state
    }, payload) {
        console.log('PAYLOAD: ', payload)
        state.favs = payload
    },
    updateFavs(state, payload) {

        state.favs.push(payload)
    },
    insertEditedFav(state, payload) {
        let objIndex = state.favs.findIndex((obj => obj.name == payload.name))
        state.favs[objIndex].Notes = payload.Notes
    },
    deleteFav(state, payload) {
        // TEST: Favs not being deleted from local storage
        state.favs = []
        state.favs = [...new Set(payload)]
    },
    showFavs(state, payload) {
        state.showFavs = payload
    },
    clearFavs(state) {
        state.favs = []
    },
    updateRecipient(state, payload) {
        state.recipientAddress = payload
    }
}

const actions = {
    addFav({
        state,
        dispatch
    }, payload) {
        let {
            name = '', version = 'latest', cdn = '', userId, online, Notes = '', description = '', url = ''
        } = payload
        if (online === false) {
            dispatch('notificationCtrl', {
                msg: 'Sorry but you cant create favourites while you are offline',
                color: 'danger'
            })
            return
        }
        // check if favorite already there 
        let alreadyAdded = false
        for (let i = 0; i < state.favs.length; i++) {
            if (state.favs[i].name.indexOf(name) > -1) {
                alreadyAdded = true
            }
        }
        if (alreadyAdded) {
            console.log('Already Added')
            dispatch('notificationCtrl', {
                msg: `${name} is already in your favourites`,
                color: 'warning'
            })
            return
        }
        // **** Varified not present
        console.log('checking login status', payload.loggedIn)

        //TODO: check loggedin status 
        if (payload.loggedIn == true) {
            // return new Promise((resolve, reject) => {
            console.log('adding to firebase ', payload)
            Firebase.database()
                .ref('user/' + userId + '/favorites/' + safeName(name))
                .set({
                    name,
                    version,
                    cdn,
                    Notes,
                    userId,
                    description,
                    url
                })
                .then(response => {
                    localStorage.setItem(`favCDNs-${payload.userCode}`, JSON.stringify(state.favs))
                    dispatch('notificationCtrl', {
                        msg: `${name} Library Added to your favourites`,
                        color: 'success'
                    })
                    Nucleus.track('Favourite-add')
                })
                .catch(error => {
                    console.log('ther was an error ', error)
                })

        } else {
            //FIXME: 'favCDNs' + UID
            localStorage.setItem('favCDNs', JSON.stringify(state.favs))
            dispatch('notificationCtrl', {
                msg: `${name} Library Added to your local favourites`,
                color: 'success'
            })
        }
        let library = name.split('.')[0]
        console.log(library)
        let ref = Firebase.database().ref('library/' + library)
        // TODO: Add full library info to use in popularity list
        ref.transaction((Favcount) => {
            return (Favcount || 0) + 1
        })
    },
    getFavs({
        commit,
        state
    }, payload) {
        console.log("USER: ", payload.uid)
        var localFavArray = []

        let userCode = payload.uid.split('').splice(0, 9).join('')
        const userPath = path.join(__dirname, '../..', `public/${userCode}`)
        // Is user logged in
        if (payload.uid && payload.online === true) { // And payload.online
            return new Promise((resolve, reject) => {
                    const db = Firebase.database()
                    const ref = db.ref('user/' + payload.uid + '/favorites/')
                    // ref.orderByChild('userId').equalTo(payload.uid)
                    ref.on('value', (snapshot) => {
                        snapshot.forEach(data => {
                            // if (data.val().userId === payload.uid) {
                            commit('updateFavs', data.val())
                            localFavArray.push(data.val())
                            // }
                        })
                        console.log("array", localFavArray)
                        console.log('LocalStoragecreation: ', JSON.stringify(localFavArray))
                        localStorage.setItem(`favCDNs-${userCode}`, JSON.stringify(localFavArray))
                    })
                })
                .then(response => {
                    console.log('I got favs', response)

                    resolve(response)
                }, error => {
                    reject(error)
                })
        } else {
            commit('clearFavs')
            console.log("User Code: ", payload.userCode)
            //IDEA: Maybe load generic favourites from local storage
            let localFavs = localStorage.getItem(`favCDNs-${payload.userCode}`) //TEST: load favourites from local storage 
            let parsedObj = JSON.parse(localFavs)
            for (var obj in parsedObj) {
                commit('updateFavs', parsedObj[obj])
            }
        }

        // get favourites from local storage
    },
    updateFavs({
        commit,
        dispatch
    }, payload) {
        console.dir(payload)
        let counter = 0
        const db = Firebase.database()
        const ref = db.ref('user/' + payload.uid + '/favorites')
        console.log("EDITING: ", safeName(payload.Data.name))
        console.log("NOTE: ", payload.Note)
        ref.child(safeName(payload.Data.name))
            .update({
                Notes: payload.Note
            }).then(response => {
                console.log('done', response)
                commit('insertEditedFav', {name: payload.Data.name, Notes: payload.Note })
                // commit('insertEditedFav', data.val())
                dispatch('notificationCtrl', {
                    msg: 'Note Updated Successfully',
                    color: 'success'
                })
                Nucleus.track('Favourite-edit')
            }).catch(error => {
                console.log(error)
            })
    },
    shareFav({state}, payload) {
       // Send Post request to cadence-desktop website to send email 
       let { Notes = "No Notes have been added for this Library", name, version, description, url } = payload
       let email = state.recipientAddress
    //    console.log(JSON.stringify({ Notes, name, description, version, url, email }))
       var sendData = JSON.stringify({ Notes, name, description, version, url, email })
    //    ?const API_URL = `http://www.cadence-desktop.com/api/share-email`
    //    const API_URL = 'http://127.0.0.1:3000/api/share-email'
       var options = {
        'method': 'POST',
        // 'hostname': '127.0.0.1',
        'hostname': 'www.cadence-desktop.com',
        // 'port': 3000,
        'path': '/api/share-email',
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      console.log("Sending")
      var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log("Done")
                // console.log(body.toString());
            });

            res.on("error", function (error) {
                console.error(error);
            });
        });

        req.write(sendData);
        req.end();
    },
    delFav({
        commit,
        state
    }, payload) {
        let tmpArr = []
        let favCount = state.favs.length
        for (let i = 0; i < favCount; i++) {
            if (state.favs[i].name !== payload.name) {
                tmpArr.push(state.favs[i])
            }
        }
        commit('deleteFav', tmpArr)
        //FIXME: 'favCDNs' + UID
        localStorage.setItem('favCDNs', JSON.stringify(state.favs))
    },
    delFirebaseFav({
        commit,
        state
    }, payload) {
        // TODO: Check for favourite in users firebase storage and delete (if logged in)
        let dbRef = Firebase.database().ref('user/' + payload.userId + '/favorites')
        dbRef.child(safeName(payload.name)).remove()
        console.log("Deleted from firebase")
    }
}

const getters = {
    favs: state => _.uniqBy(state.favs, 'name'),
    showFavs: state => state.showFavs
}

export default {
    state,
    mutations,
    actions,
    getters
}