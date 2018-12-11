import Firebase from '../../helpers/firebase';
import uid from '../../helpers/uid';

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
        let newFavs = []
        for (let i = 0; i < state.favs.length; i++) {
            if (state.favs[i].name !== payload) {
                newFavs.push(state.favs[i])
            }
        }
        console.log(newFavs)
        state.favs = newFavs

    },
    showFavs(state, payload) {
        state.showFavs = payload
    }
}

const actions = {
    addFav({
        commit,
        state
    }, payload) {
        let {
            name = '', version = 'latest', cdn = '', userId
        } = payload
        // TODO: check if favorite already there *********
        let alreadyAdded = false
        for (let i = 0; i < state.favs.length; i++) {
            if (state.favs[i].name.indexOf(name) > -1) {
                alreadyAdded = true
            }
        }
        if (alreadyAdded) {
            console.log('Already Added')
            commit('setNotification', {
                msg: `${name} is already in your favourites`,
                color: 'warning'
            })
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)
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
                    commit('setNotification', {
                        msg: `${name} Library Added to your favourites`,
                        color: 'success'
                    })

                })
                .catch(error => {
                    console.log('ther was an error ', error)
                })

        } else {
            localStorage.setItem('favCDNs', JSON.stringify(state.favs))
            commit('setNotification', {
                msg: `${name} Library Added to your local favourites`,
                color: 'success'
            })
        }
        // TODO: Increase total library favourited count by 1
        let library = name.split('.')[0]
        console.log(library)
        let ref = Firebase.database().ref('library/' + library)
        // TODO: increase value count by one
        ref.transaction((Favcount) => {
            return (Favcount || 0) + 1
        })
    },
    getFavs({
        commit,
    }, payload) {
        console.log("USER: ", payload)
        // Is user logged in
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
        // get favourites from local storage
    },
    delFav({
        commit,
        state
    }, payload) {
        // TODO: Check for favourite in users firebase storage and delete (if logged in)
    }
}

const getters = {
    favs: state => state.favs,
    showFavs: state => state.showFavs
}

export default {
    state,
    mutations,
    actions,
    getters
}