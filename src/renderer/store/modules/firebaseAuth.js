import Firebase from '../../helpers/firebase'
// import licenceKey from '../../helpers/licence'
import {
    getLicence,
    getPolicy,
    createLicence
} from '../../helpers/licence';

let auth = Firebase.auth();

const Nucleus = require('electron-nucleus')('5c2fd2e8ffc1fb00ce9582e2')


const state = {
    loggedIn: false,
    basicUser: false,
    online: true,
    currentUser: {},
    authenticating: false,
    localUserInfo: []
}

const mutations = {
    setLoggedIn(state, payload) {
        state.loggedIn = payload.loggedIn
        state.currentUser = payload.user
    },
    setLoggedOut(state) {
        state.loggedIn = false
        state.currentUser = {}
    },
    basicUser(state, payload) {
        state.basicUser = payload
        state.currentUser = {}
    },
    setOnlineStatus(state, payload) {
        state.online = payload
    },
    isAuthenticating(state, payload) {
        state.authenticating = payload
    },
    loadLocalUsers(state, payload) {
        state.localUserInfo = payload
    }
}

const actions = {
    registerNewUser({
        commit,
        dispatch
    }, payload) {
        //TODO: write code to create new user account & profile with licence key
        createLicence.query(payload.email, 'basic')
            .then(body => {
                const Licence = body.key
                console.log(Licence)
            })
        auth.createUserWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                console.log(user)
                // const Licence = licenceKey()
                const dbRef = Firebase.database().ref('user/' + user.uid)
                dbRef.set({
                        licence: '8763298329380938029', // licenceKey(),
                        email: payload.email,
                        paid: false
                    })
                    .then(() => {
                        // Call addFav 
                        commit('setLoggedIn', {
                            loggedIn: true,
                            user: user.uid
                        })
                        dispatch('addFav', {
                            name: 'Cadence_Favorites',
                            version: "0.1.0 beta",
                            cdn: `Favourites added from seach results will appear here for future use`,
                            userId: user.uid,
                            online: true,
                            loggedIn: true
                        })
                        dispatch('downloadCDN', {cdn: 'seed', currentUser: user.uid})
                        // check for local user register
                        let userData = JSON.stringify({
                            uid: user.uid,
                            email: payload.email
                        })
                        if (localStorage.hasOwnProperty('cadenceUsers')) {
                            let localUserArr = [] // load dropdown default
                            localUserArr.push(userData)
                            let parsedObj = JSON.parse(localStorage.getItem('cadenceUsers'))
                            for (var obj in parsedObj) {
                                localUserArr.push(JSON.stringify(parsedObj[obj]))
                            }
                            localStorage.setItem('cadenceUsers', `[${localUserArr}]`)
                        } else {
                            localStorage.setItem('cadenceUsers', `[${userData}]`)
                        }
                        Nucleus.track('Registration')
                        dispatch('notificationCtrl', {
                            msg: `Welcome!, Your local dev server is running at http://localhost:9990`,
                            color: 'success'
                        })
                    })
                //TEST: provide use with licence key
                //TEST: Create profile in database
                //TEST: Store users licence key, paidup status, email@address & userID 

            })
            .catch(e => console.log(e.message));
    },
    authenticate({
        commit,
        dispatch
    }, payload) {
        //TODO: Check local storage for licence key.
        // If online authenticate with firebase if not log user in locally and load localStorageData
        commit('isAuthenticating', true)
        let {
            email,
            password
        } = payload
        console.log(email)
        auth.signInWithEmailAndPassword(email, password)
            .then(function (data) {
                console.log('DATA:', data)
                let user = auth.currentUser
                commit('setLoggedIn', {
                    loggedIn: true,
                    user: user.uid
                })
                commit('isAuthenticating', false)

                dispatch('notificationCtrl', {
                    msg: `Welcome back!, Your local dev server is running at http://localhost:9990`,
                    color: 'success'
                })
                Nucleus.track('Login')
            }).catch(err => {
                console.log(err)
                dispatch('notificationCtrl', {
                    msg: `There was a problem authenticating you!
                 - Please try a different username or password`,
                    color: 'danger'
                })
                commit('isAuthenticating', false)
            })

    },
    signOut({
        commit
    }) {
        auth.signOut();
        commit('setLoggedOut')
        commit('basicUser', true)
    },
    basicUser({
        commit
    }, payload) {
        commit('basicUser', payload)
    },
    accessRights({
        commit,
        state
    }, payload) {
        if (!state.loggedIn & payload.check === 'logged in') {
            commit('setNotification', {
                msg: `You must be logged in to ${payload.action}`,
                color: 'warning'
            })
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)
            return false
        }
        if (!state.online) {
            commit('setNotification', {
                msg: `NETWORK ERROR ${payload.action}, You appear to be offline`,
                color: 'danger'
            })
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)
            return false
        }
    },
    loggedInStatusCheck() {
        var user = Firebase.auth().currentUser
        if (user) {
            console.log("Logged in as: ", user)
        } else {
            console.log('No user logged in')
        }
    },
    networkStatus({
        commit
    }) {
        require('dns').resolve('www.google.com', function (err) {
            if (err) {
                console.log("No connection");
                commit('setOnlineStatus', false)
            } else {
                console.log("Connected");
                commit('setOnlineStatus', true)

            }
        });
    },
    getLocalUserInfo({
        commit
    }) {
        let localUserArr = []
        let parsedObj = JSON.parse(localStorage.getItem('cadenceUsers'))
        for (var obj in parsedObj) {
            localUserArr.push(parsedObj[obj])
        }
        commit('loadLocalUsers', localUserArr)
    }
}

const getters = {
    loggedIn: state => state.loggedIn,
    currentUser: state => state.currentUser,
    basicUser: state => state.basicUser,
    online: state => state.online,
    authenticating: state => state.authenticating,
    localUserInfo: state => state.localUserInfo
}

export default {
    state,
    mutations,
    actions,
    getters
}