

import Firebase from 'firebase';
import Router from 'vue-router';

var config = {
    apiKey: "AIzaSyBhAK7lteBJ1_0ynbyC3C0KnZq7EHzbQpU",
    authDomain: "cadence-8edfc.firebaseapp.com",
    databaseURL: "https://cadence-8edfc.firebaseio.com",
    storageBucket: "cadence-8edfc.appspot.com"
}

const state = {
    loggedIn: false,
    CurrentUser: ''
}

const mutations = {
    setLoggedin(state, payload) {
        state.loggedIn = payload.loggedIn
        state.currentUser = payload.user
    }
}

const actions = {
    authenticate({commit}, payload) {
        Firebase.initializeApp(config);
        const auth = Firebase.auth();
        var usersRef = Firebase.database().ref('users')
        let vm = this
        const promise = auth.signInWithEmailAndPassword(payload.email, payload.password)
           .then(function (data) {
              return loggedInUser = auth.currentUser,
                commit('setLoggedIn', {loggedIn:true, user: loggedInUser})
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