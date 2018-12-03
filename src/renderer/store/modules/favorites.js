
import Firebase from '../../helpers/firebase';

// let database = Firebase.database();
let dbRoot = Firebase.firestore().ref()
let favs = dbRoot.child('favs')


const state = {
    favs: []
}

const mutations = {
    loadFavs({state}, payload) {
        state.favs = payload
    },
    updateFavs({state}, payload) {
        state.favs.push(payload)
    },
    deleteFav() {

    }
}

const actions = {
    addFav({commit, state}, payload) {
         favs.push()
    },
    getFavs({commit}, payload) {
        console.log('favourites action' , dbRoot)
        favs.orderByValue().on('value', (snapshot) => {
            snapshot.forEach((data) => {
                console.log(`Favourites: ${data.key} ${data.value}`)
                commit('updateFavs', data.value)
            })
            })
    }
}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}