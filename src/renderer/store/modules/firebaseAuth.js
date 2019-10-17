import Firebase from '../../helpers/firebase'
import {
    getLicence,
    getPolicy,
    createLicence
} from '../../helpers/licence';

import daysRemaining from '../../helpers/licenseTimer';
import avatarMaker from '../../helpers/avatar';

let auth = Firebase.auth();

const Nucleus = require('electron-nucleus')('5c2fd2e8ffc1fb00ce9582e2')
const UsernameGen = require('username-generator')

const state = {
    loggedIn: false,
    basicUser: false,
    online: true,
    currentUser: {},
    authenticating: false,
    localUserInfo: [],
    licenseInfo: {},
    licenseTimeout: 30,
    osType: " "
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
    },
    setLicenseTimeout(state, payload) {
        state.licenseTimeout = payload
    },
    setOsType(state) {
        const OS = window.navigator.platform.split(' ')[0]
        state.osType = OS
    }
}

const actions = {
    registerNewUser({
        commit,
        state,
        dispatch
    }, payload) {
        //TODO: write code to create new user account & profile with licence key
        console.log(payload.email)
        createLicence.query(payload.email, 'basic')
            .then(body => {
                commit('setLicenseInfo', body)
                 console.log(body)
        let username = UsernameGen.generateUsername()
        // let avatar = `https://avatars.dicebear.com/v2/bottts/${username}.svg`
        let avatar = avatarMaker(username)
        let password = payload.password
        auth.createUserWithEmailAndPassword(payload.email, password)
            .then(UserCredential => {
                console.log(UserCredential)
                let {
                    key,
                    expire,
                    policy,
                    status,
                    version,
                    userEmail
                } = state.licenseInfo
                console.log("KEY: ", key)
                const dbRef = Firebase.database().ref('user/' + UserCredential.uid)
                dbRef.set({
                    licence: key, // Pulled fro Nucleus
                    username: username,
                    email: userEmail,
                    paid: false,
                    expire: expire,
                    policy: policy,
                    status: status,
                    version: version,
                    avatar: avatar
                })
                    .then(() => {
                        // TODO: Add to Cadence users local storage for offline use
                        // commit('setLoggedIn', {
                            // loggedIn: true,
                            // user: user.uid
                        // })
                        dispatch('addFav', {
                            name: 'CDN-Desktop_Favorites',
                            version: "0.1.0 beta",
                            cdn: `Favourites added from seach results will appear here for future use readthe notes below for more information`,
                            userId: UserCredential.uid,
                            Notes: `<br><h3>Activate CDN-Desktop to unlock Premium Features</h3>
                            <p>Want to support our team contiune development on CDN Desktop and get updates and enhancements?</p>
                            <p>Head over to <a href='https://cadence-desktop.com' target='_blank' class='url'>https://cadence-desktop.com</a> to purchase a full licence for just $5 and you&#39;ll get access to all the features and updates for life!!</p>
                            <p>We will email you a licence code that you can use to fully activate CDN Desktop</p>
                            <p><img src='https://firebasestorage.googleapis.com/v0/b/cadence-8edfc.appspot.com/o/cadence-Activation.gif?alt=media&token=922b33a0-35af-4432-9e19-d06c1e4bfd71' alt='Cadence Activation' referrerPolicy='no-referrer' /></p>`,
                            online: true,
                            loggedIn: true
                        })
                        dispatch('downloadCDN', {
                            cdn: 'seed',
                            currentUser: UserCredential.uid
                        })
                        // check for local user register
                        let userData = JSON.stringify({
                            licence: key,
                            uid: UserCredential.uid,
                            email: payload.email,
                            expire,
                            policy,
                            status,
                            version,
                            username,
                            avatar
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
            }, err => {
                return;
            })
            }).then(()=>{
                        dispatch('authenticate',{email:payload.email, password:payload.password})
                        
            })
            .then(()=>{
                            
                        commit('setLoggedIn', {
                            loggedIn: true,
                            user: UserCredential.uid
                        })
                        })
            .catch(e =>{
                console.log(e.message);
                    return e.message;
            })
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
                    msg: `Welcome back!, Your local dev server is running at http://localhost:9082`,
                    color: 'success'
                })
                // Load LicenseInfo for user from local storage into state
                let userObj = {}
                let parsedUserData = JSON.parse(localStorage.getItem('cadenceUsers'))
                console.log('PARSED: ', parsedUserData)
                let userFound = false
                if (parsedUserData) {
                    for (let i = 0; i < parsedUserData.length; i++) {
                        if (parsedUserData[i].email === email) {
                            userFound = true
                        }
                    }
                }
                if (!parsedUserData || !userFound) {
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
                            version,
                            username,
                            avatar
                        } = snapshot.val()
                        commit('setLicenseInfo', {
                            licence,
                            email,
                            expire,
                            policy,
                            status,
                            version,
                            uid,
                            username,
                            avatar
                        })
                        let userData = JSON.stringify(snapshot)
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
    sendPasswordResetEmail({ dispatch }, payload) {
        console.log('EMAIL FOR RESET ', payload.email)
        let emailAddress = payload.email;
        auth.sendPasswordResetEmail(emailAddress).then(function () {
            // Email sent.
            dispatch('notificationCtrl', { msg: `Password reset email sent to ${emailAddress}`, color: 'success' })
            Nucleus.track('Password Reset')
        }).catch(function (error) {
            // An error happened.
            console.log(error)
        });
    },
    basicUser({
        commit
    }, payload) {
        commit('basicUser', payload)
    },
    accessRights({
        commit,
        dispatch,
        state
    }, payload) {
        // TODO: check license type & status from state
        if(state.osType==="Linux") return true
        if (payload.check === "license") {
            let timeLeft = daysRemaining(state.licenseInfo.expire)
            if (timeLeft > 0 && state.licenseInfo.policy !== 'pro') {
                // dispatch('notificationCtrl', {msg: `Your 30 day trial will end in ${timeLeft} days time`, color: "warning"})
                commit("setLicenseTimeout", timeLeft)
            } else if (timeLeft < 0 && state.licenseInfo.policy !== 'pro') {
                console.log(timeLeft)
                dispatch('notificationCtrl', { msg: `Your 30 day trial has ended, Please purchase a licence to contimue using this feature`, color: "danger" })
                return false
            } else if (timeLeft < 0 && state.licenseInfo.policy !== 'pro') {
                dispatch('notificationCtrl', { msg: `Your yearly license has expired, Please purchase a licence to contimue using this feature`, color: "danger" })
                return false
            } else {
                return true
            }
        }
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
    updateLicense({
        commit,
        dispatch,
        state
    }, payload) {
        getLicence.query(null, null, payload.licence)
            .then(body => {
                console.log("Licence Info ", body)
                if (body.error === "License not existing.") {
                    dispatch('notificationCtrl', { msg: "licence not found on server", color: 'danger' })
                    return
                }
                if (state.licenseInfo.email === body.userEmail) {
                    commit('setLicenseInfo', body)
                    // remove user from local user storage
                    let localUserArr = []
                    let parsedObj = JSON.parse(localStorage.getItem('cadenceUsers'))
                    for (var obj in parsedObj) {
                        if (obj.userEmail != body.userEmail) {
                            localUserArr.push(obj)
                        }
                    }
                    // pull params from getLicence body
                    let {
                        userEmail,
                        expire,
                        policy,
                        licence,
                        status,
                        version,
                        avatar
                    } = body
                    // create new user data including userId
                    let newUserData = {
                        licence,
                        uid: state.currentUser,
                        email: userEmail,
                        expire,
                        policy,
                        status,
                        version,
                        avatar
                    }
                    // push new user data onto temp array
                    localUserArr.push(newUserData)
                    //recreate local users in local storage
                    localStorage.setItem('cadenceUsers', JSON.stringify(localUserArr))

                    //Update users licence info in firebase
                    Firebase.database().ref('user/' + state.currentUser)
                        .update(body)
                        .then(() => {
                            // Your Licence has been updated thankyou
                            Nucleus.track('License Updated')
                            dispatch('notificationCtrl', { msg: "Thankyou for updating your licence you can now access premium features", color: 'success' })
                        })
                } else {
                    // licence does not belong to this email address
                    dispatch('notificationCtrl', { msg: "Sorry but this licence does not match the email address you're signed in with", color: 'danger' })
                }

            })
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
    licenseInfo: state => state.licenseInfo,
    licenseTimeout: state => state.licenseTimeout,
    osType: state => state.osType
}

export default {
    state,
    mutations,
    actions,
    getters
}
