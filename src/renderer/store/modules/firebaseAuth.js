import Firebase from '../../helpers/firebase'
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
    localUserInfo: [],
    licenseInfo: {}
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
    },
    setLicenseInfo(state, payload) {
        state.licenseInfo = payload
    }
}

const actions = {
    registerNewUser({
        commit,
        state,
        dispatch
    }, payload) {
        //TODO: write code to create new user account & profile with licence key
        createLicence.query(payload.email, 'basic')
            .then(body => {
                commit('setLicenseInfo', body)
                // console.log(Licence)
            })
        auth.createUserWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                console.log(user)
                let {
                    key,
                    expire,
                    policy,
                    status,
                    version,
                    userEmail
                } = state.licenseInfo
                console.log("KEY: ", key)
                const dbRef = Firebase.database().ref('user/' + user.uid)
                dbRef.set({
                        licence: key, // Pulled fro Nucleus
                        email: userEmail,
                        paid: false,
                        expire: expire,
                        policy: policy,
                        status: status,
                        version: version
                    })
                    .then(() => {
                        // TODO: Add to Cadence users local storage for offline use
                        commit('setLoggedIn', {
                            loggedIn: true,
                            user: user.uid
                        })
                        dispatch('addFav', {
                            name: 'Cadence_Favorites',
                            version: "0.1.0 beta",
                            cdn: `Favourites added from seach results will appear here for future use readthe notes below for more information`,
                            userId: user.uid,
                            Notes: `<br><h3>Activate Cadence to unlock Premium Features</h3>
                            <p>Want to support our team contiune development on Cadence and get updates and enhancements?</p>
                            <p>Head over to <a href='https://cadence-desktop.com' target='_blank' class='url'>https://cadence-desktop.com</a> to purchase a full licence for just $5 and you&#39;ll get access to all the features and updates for life!!</p>
                            <p>We will email you a licence code that you can use to fully activate Cadence</p>
                            <p><img src='https://firebasestorage.googleapis.com/v0/b/cadence-8edfc.appspot.com/o/cadence-Activation.gif?alt=media&token=922b33a0-35af-4432-9e19-d06c1e4bfd71' alt='Cadence Activation' referrerPolicy='no-referrer' /></p>`,
                            online: true,
                            loggedIn: true
                        })
                        dispatch('downloadCDN', {
                            cdn: 'seed',
                            currentUser: user.uid
                        })
                        // check for local user register
                        let userData = JSON.stringify({
                            licence: key,
                            uid: user.uid,
                            email: payload.email,
                            expire,
                            policy,
                            status,
                            version
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
                // Load LicenseInfo for user from local storage into state
                let userObj = {}
                let parsedUserData = JSON.parse(localStorage.getItem('cadenceUsers'))
                if (parsedUserData === undefined) {
                    // Get data from firebase
                    let dbRef = Firebase.database().ref('user/' + user.uid)
                    dbRef.on('value', snapshot => {
                        let {
                            licence,
                            uid,
                            email,
                            expire,
                            policy,
                            status,
                            version
                        } = snapshot
                        commit('setLicenseInfo', {
                            licence,
                            email,
                            expire,
                            policy,
                            status,
                            version,
                            uid
                        })
                    })
                } else {
                    // Get from local storage
                    for (let i = 0; i < parsedUserData.length; i++) {
                        if (parsedUserData[i].email === email) {
                            userObj = parsedUserData[i]
                        }
                    }
                }

                // Send to mutation to update State
                commit('setLicenseInfo', userObj)
                // Log eventto Nucleus
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
        // TODO: check license type & status from state
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
    localUserInfo: state => state.localUserInfo,
    licenseInfo: state => state.licenseInfo
}

export default {
    state,
    mutations,
    actions,
    getters
}