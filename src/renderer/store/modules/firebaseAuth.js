

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
    registerNewUser({commit}, payload) {
        //TODO: write code to create new user account & profile with licence key
       auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            console.log(user)
            //TODO: provide use with licence key
            //TODO: Create profile in database
            //TODO: Store users licence key, paidup status, email@address & userID 
        })
          .catch(e => console.log(e.message));
    },
    authenticate({commit}, payload) {
        //TODO: Check local storage for licence key.
        let { email , password } = payload
        console.log(email)
        auth.signInWithEmailAndPassword(email, password)
           .then(function (data) {
               console.log('DATA:', data)
            let user = auth.currentUser
            commit('setLoggedIn', {loggedIn:true, user: user.uid})

            commit('setNotification', {msg: `Welcome back!, Your local dev server is running at http://localhost:9990`, color: 'success'}) 
            setTimeout(() => {
                commit('clearNotification')
            }, 6000)

           }).catch(err=> {
               console.log(err)
               commit('setNotification', {msg: `There was a problem authenticating you!
                                         - Please try a different username or password`, color: 'danger'}) 
            setTimeout(() => {
                commit('clearNotification')
            }, 6000)
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