import Firebase from '../../helpers/firebase';
import uid from '../../helpers/uid';
import _ from 'lodash';

const path = require('path')
const find = require('find')
const fs = require('fs')

const state = {
    favs: [],
    showFavs: false
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
    insertEditedFav(state, payload){
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
    }
}

const actions = {
    addFav({
        state,
        dispatch
    }, payload) {
        let {
            name = '', version = 'latest', cdn = '', userId, online
        } = payload
        if(online === false) {
            dispatch('notificationCtrl', {msg: 'Sorry but you cant create favourites while you are offline', color: 'danger'})
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
            Firebase.database().ref('favs/' + uid())
                .set({
                    name,
                    version,
                    cdn,
                    userId
                })
                .then(response => {
                    localStorage.setItem(`favCDNs-${payload.userCode}`, JSON.stringify(state.favs))
                    dispatch('notificationCtrl', {
                        msg: `${name} Library Added to your favourites`,
                        color: 'success'
                    })

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
       
        let userCode = payload.uid.split('').splice(0,9).join('')
        const userPath = path.join(__dirname, '../..', `public/${userCode}`) 
        // Is user logged in
        if (payload.uid && payload.online === true) {  // And payload.online
            return new Promise((resolve, reject) => {
                const db = Firebase.database();
                const ref = db.ref("favs");
                ref.orderByChild('userId').equalTo(payload.uid)
                ref.on('value', (snapshot) => {
                    snapshot.forEach((data) => {
                       if (data.val().userId === payload.uid) {
                        commit('updateFavs', data.val())
                        
                        // console.log('dataVal ', fileName)
                        localFavArray.push(data.val())
                       }
                      
                    })
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
            for (var obj in parsedObj){
                commit('updateFavs', parsedObj[obj])
            }
        }
        
        // get favourites from local storage
    },
    updateFavs({commit}, payload){
        console.dir(payload)
        let counter = 0
         Firebase.database().ref('favs')
        .orderByChild('name').equalTo(payload.Data.name).limitToFirst(1)
        .on('value', snap => {
            snap.forEach(data => {
                if (data.val().userId === payload.Data.userId) {
                    console.log('update value')
                    console.log(data.key)
                    if (counter < 1){
                        Firebase.database().ref('favs').child(data.key).update({
                            Notes: payload.Note
                        }).then(response => {
                            console.log('done', response)
                            commit('insertEditedFav', data.val())
                           // commit('updateFavs', data.val())  
                        }).catch(error=> {
                            console.log(error)
                        })
                    }
                   counter++
                }
            })
        })
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
    delFirebaseFav({commit, state}, payload) {
             // TODO: Check for favourite in users firebase storage and delete (if logged in)
        const ref = Firebase.database().ref('favs')
        .orderByChild('name').equalTo(payload.name)
        .on('value', snap => {
            snap.forEach((data) => {
                if (data.val().userId === payload.userId) {
                    console.log('delete value')
                    console.log(data.key)
                    Firebase.database().ref('favs').child(data.key).remove()
                }
            })
        })
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