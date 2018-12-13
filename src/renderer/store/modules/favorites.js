import Firebase from '../../helpers/firebase';
import uid from '../../helpers/uid';
import _ from 'lodash';

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
            name = '', version = 'latest', cdn = '', userId
        } = payload
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
                    // resolve(response)
                    console.log(response)
                    localStorage.setItem('favCDNs', JSON.stringify(state.favs))
                    dispatch('notificationCtrl', {
                        msg: `${name} Library Added to your favourites`,
                        color: 'success'
                    })

                })
                .catch(error => {
                    console.log('ther was an error ', error)
                })

        } else {

            localStorage.setItem('favCDNs', JSON.stringify(state.favs))
            dispatch('notificationCtrl', {
                msg: `${name} Library Added to your local favourites`,
                color: 'success'
            })
        }
        let library = name.split('.')[0]
        console.log(library)
        let ref = Firebase.database().ref('library/' + library)
        // TODO: increase value count by one 
        //TEST:
        ref.transaction((Favcount) => {
            return (Favcount || 0) + 1
        })
    },
    getFavs({
        commit,
    }, payload) {
        console.log("USER: ", payload)
        // Is user logged in
        if (payload) {
            return new Promise((resolve, reject) => {
                const db = Firebase.database();
                const ref = db.ref("favs");
                ref.orderByChild('userId').equalTo(payload).limitToFirst(1)
                ref.on('value', (snapshot) => {
                    snapshot.forEach((data) => {
                        commit('updateFavs', data.val())
                    })
                })
            })
            .then(response => {
                resolve(response)
            }, error => {
                reject(error)
            })
        } else {
            commit('clearFavs')
            let localFavs = localStorage.getItem('favCDNs')
            let parsedObj = JSON.parse(localFavs)
            for (var obj in parsedObj){
                commit('updateFavs', parsedObj[obj])
            }
        }
        
        // get favourites from local storage
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