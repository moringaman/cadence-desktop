

import Firebase from '../../helpers/firebase'
import licenceKey from '../../helpers/licence'
let auth = Firebase.auth();

const state = {
    loggedIn: false,
    basicUser: false,
    online: true,
    currentUser: {},
    authenticating: false
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
    },
    setOnlineStatus (state, payload) {
        state.online = payload
    },
    isAuthenticating(state, payload) {
        state.authenticating = payload
    }
}

const actions = {
    registerNewUser({commit, dispatch}, payload) {
        //TODO: write code to create new user account & profile with licence key
       auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            console.log(user)
            const Licence = licenceKey()
            const dbRef = Firebase.database().ref('user/' + user.uid)
            dbRef.set({
                licence: licenceKey(),
                email: payload.email,
                paid: false
            })
            .then(() => {
            commit('setLoggedIn', {loggedIn:true, user: user.uid})
            dispatch('notificationCtrl', {msg: `Welcome!, Your local dev server is running at http://localhost:9990`, color: 'success'}) 
            })
            //TEST: provide use with licence key
            //TEST: Create profile in database
            //TEST: Store users licence key, paidup status, email@address & userID 
        
        })
          .catch(e => console.log(e.message));
    },
    authenticate({commit, dispatch}, payload) {
        //TODO: Check local storage for licence key.
        commit('isAuthenticating', true)
        let { email , password } = payload
        console.log(email)
        auth.signInWithEmailAndPassword(email, password)
           .then(function (data) {
               console.log('DATA:', data)
            let user = auth.currentUser
            commit('setLoggedIn', {loggedIn:true, user: user.uid})
            commit('isAuthenticating', false)

            dispatch('notificationCtrl', {msg: `Welcome back!, Your local dev server is running at http://localhost:9990`, color: 'success'}) 
            // setTimeout(() => {
            //     commit('clearNotification')
            // }, 6000)

           }).catch(err=> {
               console.log(err)
               dispatch('notificationCtrl', {msg: `There was a problem authenticating you!
                                         - Please try a different username or password`, color: 'danger'}) 
                commit('isAuthenticating', false)
           })
           
    },
    signOut({commit}) {
        auth.signOut();
        commit('setLoggedOut')
        commit('basicUser', true)
    },
    basicUser({commit}, payload) {
        commit('basicUser', payload)
    },
    accessRights({commit, state}, payload) {
        if (!state.loggedIn & payload.check === 'logged in') {
            commit('setNotification', {msg: `You must be logged in to ${payload.action}`, color: 'warning'})
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)
        }
        if (!state.online) {
            commit('setNotification', {msg: `NETWORK ERROR ${payload.action}, You appear to be offline`, color: 'danger'})
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)
        }
    }
}

const getters = {
    loggedIn: state => state.loggedIn,
    currentUser: state => state.currentUser,
    basicUser: state => state.basicUser,
    online: state => state.online,
    authenticating: state => state.authenticating
}

export default {
    state,
    mutations,
    actions,
    getters
}