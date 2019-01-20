import Firebase from '../../helpers/firebase';

const state = {
    currentAd: {}
}

const mutations = {
    setCurrentAd(state, payload) {
        state.currentAd = payload
    }
}

const actions = {
    getRandomAd({commit}) {

        let pickRandom = function() {
            const randomIdx = Math.floor(Math.random() * 2) + 1
            Firebase.database().ref('ads/').limitToFirst(randomIdx)
             .on('value', (snapshot) => {
                 console.log(snapshot)
                 snapshot.forEach(data => {
                     console.log(data.val())
                     commit('setCurrentAd', data.val())
                 })
             })
        }
        pickRandom()
        setInterval(() => {
           pickRandom()
        }, 60000)
       
    }
}

const getters = {
    currentAd: state => state.currentAd
}

export default {
    state,
    mutations,
    actions,
    getters
}