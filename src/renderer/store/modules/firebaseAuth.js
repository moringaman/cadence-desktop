

import Firebase from '../../helpers/firebase'
let auth = Firebase.auth();

const state = {
    loggedIn: false,
    currentUser: {}
}

const mutations = {
    setLoggedIn (state, payload) {
        state.loggedIn = payload.loggedIn
        state.currentUser = payload.user
    },
    setLoggedOut (state) {
        state.loggedIn = false
    }
}

const actions = {
    authenticate({commit}, payload) {
        let { email , password } = payload
        console.log(email)
        auth.signInWithEmailAndPassword(email, password)
           .then(function (data) {
               console.log('DATA:', data)
            let user = auth.currentUser
            commit('setLoggedIn', {loggedIn:true, user: user.uid})
           }).catch(err=> {
               console.log(err)
           })
    },
    signOut({commit}) {
        auth.signOut();
        commit('setLoggedOut')
    }

}

const getters = {
    loggedIn: state => state.loggedIn,
    currentUser: state => state.currentUser
}

export default {
    state,
    mutations,
    actions,
    getters
}