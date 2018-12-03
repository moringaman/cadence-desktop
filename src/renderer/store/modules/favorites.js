import Firebase from '../../helpers/firebase';
import uid from '../../helpers/uid';
// let database = Firebase.database();



const state = {
    favs: []
}

const mutations = {
    loadFavs({
        state
    }, payload) {
        state.favs = payload
    },
    updateFavs(state, payload) {
        state.favs.push(payload)
    },
    deleteFav() {

    }
}

const actions = {
    addFav({
        commit,
        state
    }, payload) {
        let {
            cdnName = '', version = 'latest', cdn = '', userId
        } = payload
        return new Promise((resolve, reject) => {
            Firebase.database().ref('favs/' + uid())
                .set({
                    cdnName,
                    version,
                    cdn,
                    userId
                })
                .then(response => {
                    resolve(response)
                    commit('setNotification', `${cdnName} Library Added to your favourites`)
                }, error => {
                    reject(error)
                })
        })
        // TODO: Increase total library favourited count by 1
    },
    getFavs({
        commit,
    }, payload) {
        console.log("USER: ", payload)
        return new Promise((resolve, reject) => {
                const db = Firebase.database();
                const ref = db.ref("favs");
                const favArray = []
                ref.orderByChild('userId').equalTo(payload).limitToFirst(1)
                ref.on('value', (snapshot) => {
                    snapshot.forEach((data) => {
                        // console.log(`Favourites: ${data.key} ${data.value}`)
                        commit('updateFavs', data.val())
                    })
                })
            })
            .then(response => {
                resolve(response)
            }, error => {
                reject(error)
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