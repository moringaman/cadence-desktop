

import Firebase from '../../helpers/firebase'
let auth = Firebase.auth();

const state = {
    loggedIn: false,
    basicUser: false,
    currentUser: {}
}

const mutations = {
    setLoggedIn (state, payload) {
        state.loggedIn = payload.loggedIn
        state.currentUser = payload.user
    },
    setLoggedOut (state) {
        state.loggedIn = false
    },
    basicUser (state, payload) {
        state.basicUser = payload
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

            commit('setNotification', `Welcome back`) 
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)

           }).catch(err=> {
               console.log(err)
           })
    },
    signOut({commit}) {
        auth.signOut();
        commit('setLoggedOut')
        commit('basicUser', true)
    },
    basicUser({commit}, payload) {
        commit('basicUser', payload)
    }

}

const getters = {
    loggedIn: state => state.loggedIn,
    currentUser: state => state.currentUser,
    basicUser: state => state.basicUser
}

export default {
    state,
    mutations,
    actions,
    getters
}