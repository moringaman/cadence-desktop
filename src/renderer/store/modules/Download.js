import Firebase from '../../helpers/firebase';
import uid from '../../helpers/uid';
const path = require('path')
const find = require('find')
const fs = require('fs')
var app  = require('electron').remote.app

const state = {
   localCDNs: [], //localStorage.getItem('localCDNs')
   ipAddress: '127.0.0.1',
   progress: 0,
   currentFile: '',
   userCode: ''
}

const mutations = {
  setLocalCDNs(state, payload) {
    //   let {name, cdnVersion, file} = payload
    //   let cdnObj = {cdnName, cdnVersion, file}
         let cdnObj = payload
         console.log('PASSED', cdnObj)
        state.localCDNs.push(payload)
  },
  loadStoredCDNs(state, payload) {
    //TODO: Take code from favs to search firebase if online and download cdn's if not present

    //   let localCDNStorage = localStorage.getItem(`localCDNs-${state.userCode}`)
    //FIXME: 'localCDNs' + UID if user exists
    //   console.log('localStorage', JSON.parse(localCDNStorage))
    console.log(JSON.parse(payload))
    // if (state.localCNDs.length > 0) {
    let parsedObj = JSON.parse(payload)
     for (var obj in parsedObj) {
         console.log(parsedObj[obj])
        state.localCDNs.push(parsedObj[obj])
     } 
    // }
  },
  setIpAddress(state,payload){
      state.ipAddress = payload
  },
  updateProgress(state, payload) {
      state.progress = payload
  },
  setCurrentFile(state, payload) {
      state.currentFile = payload
  },
  setRemovedCDN(state, payload) {
      state.localCDNs = []
    state.localCDNs = payload
  },
  setUserCode(state, payload){
      state.userCode = payload
  }
}

const actions = {
    downloadCDN({commit, state, dispatch}, {cdn, cdnName, version, wget, currentUser}) {
        if (state.online === false) {
            dispatch('notificationCtrl', {msg: "Download of library failed - NETWORK ERROR", color: 'danger'})
            return
        }
        const src = cdn;
        let name = cdnName
        let cdnVersion = version
        let userCode = currentUser.split("").splice(0,9).join("")
        const file = cdn.split('/').splice('-1' )[0]
        console.log('FILE: ',file);
        // const userPath = path.join(__dirname, '../..', `public/${userCode}`) 
        const userPath = path.join(`${app.getPath('userData')}`, `/${userCode}`) 
        if (!fs.existsSync(userPath)) {
            console.log('creating Folder')
            fs.mkdirSync(userPath)
        }
        console.log(userPath)
        const output = userPath + '/' + file;
        const options = {
            // see options below
         };
        let fileExists = false
         find.file(/\.js$/, userPath, (files) => {
             console.log(files)
             for (let i=0; i<files.length; i++){
                if (files[i] === `${userPath}/${file}`) {  // <-- new path
                    fileExists = true
                }
            } 
            console.log('File Exists?:', fileExists) 
            
         console.log('File Exists? - 2:', fileExists) 
         if (fileExists === false) {

            

            let download = wget.download(cdn, output, options);
            download.on('error', function(err) {
                console.log(err);
            });
            download.on('start', function(fileSize) {
                console.log(fileSize);
                commit('setCurrentFile', file)
            });
            download.on('end', function(output) {
                console.log(output);

             commit('setLocalCDNs', {name, cdnVersion, file}) 
             //TODO: Store download in firebase
             let userId = currentUser
              Firebase.database()
                .ref('downloads/' + uid())
                .set({
                    cdn,
                    name,
                    version,
                    userId
                })
                .then( response=> {
                    localStorage.setItem(`localCDNs-${userCode}`, JSON.stringify(state.localCDNs)) //FIXME: 'localCDNs' + UID
                    // console.log("LocalCDNs: ", localCDNs)
                     dispatch('notificationCtrl', {msg: `Downloaded: ${file} for local use via http://localhost:9990/${userCode}`, color: 'success'}) 
                })
                .catch(error=>{
                    console.log('An error occured')
                })

            });
            download.on('progress', function(progress) {
                typeof progress === 'number'
                console.log(progress)
                commit('updateProgress', progress)
                // code to show progress bar
            });

         } else {
            dispatch('notificationCtrl', { msg: `${file} has already been downloaded - check your local storage`, color: 'warning'}) 
         }
        })       
    //   console.log(ext);
  },
  deleteCDN({commit, state, dispatch}, payload) {
    // const downloadPath = path.join(__dirname, '../..', `public/${state.userCode}`)
    const downloadPath = path.join(`${app.getPath('userData')}`, `/${state.userCode}`) 

    console.log('file to delete: ', payload)
    fs.unlink(`${downloadPath}/${payload}`, (err) => {
        // if (err) throw err;
        console.log(`${downloadPath}/${payload} was deleted`);
        // delete local storage pointer
        let newCDNs = []
        for(let i=0; i<state.localCDNs.length; i++){
            if(state.localCDNs[i].file !== payload) {
                newCDNs.push(state.localCDNs[i])
            }
        } 
        commit('setRemovedCDN', newCDNs) 
        localStorage.setItem('localCDNs', JSON.stringify(state.localCDNs)) //FIXME: 'localCDNs' + UID
        dispatch('notificationCtrl', { msg:`${payload} has been removed from your local storage`, color: 'success'})
      });
      //  Remove from firebase if Online
      // TODO: Do online check my passing online state
      Firebase.database()
        .ref('downloads')
        .orderByChild('file').equalTo(payload)
        .on('value', snap => {
            snap.forEach(data => {
                let first9Chars = data.val().userId.split("").splice(0,9).join('')
                if( first9Chars === state.userCode ) {
                    Firebase.database().ref('downloads').child(data.key).remove()
                }
            })
        })
  },
  getCDNs({commit, state}, payload) {
    let localCDNArray = []
    //  const userPath = path.join(__dirname, '../..', `public/${state.userCode}`) 
    const userPath = path.join(`${app.getPath('userData')}`, `/${state.userCode}`) 

      if(payload.online === true) {
        const db = Firebase.database()
        const ref = db.ref('downloads')
        ref.orderByChild('userId').equalTo(payload.userId).limitToFirst(1)
        .on('value', (snapshot) => {
            snapshot.forEach(data => {
                if(data.val().userId === payload.userId){
                    localCDNArray.push(data.val())
                    let fileExists = false
                    let fileName = data.val().cdn.split('/').splice(-1)
                    find.file(/\.js$/, userPath, (files) => {
                        console.log(files)
                        for (let i=0; i<files.length; i++){
                           if (files[i] === `${userPath}/${fileName}`) {  // <-- new path
                              return fileExists = true
                           }
                       } 
                       if (!fileExists) {
                           // if no localCDN download it
                        console.log('need to download: ', fileName) 
    
                        let download = wget.download(data().cdn, `${userPath}/${fileName}`);
                        download.on('error', function(err) {
                            console.log(err);
                        });
                        download.on('start', function(fileSize) {
                            console.log(fileSize);
                        });
                        download.on('end', function(output) {
                            console.log(output);
                        });
    
                       }
                    })
                }
            })
            commit('setLocalCDNs', localCDNArray)
        })
      } else {
          // Pull CDN's from local storage
          let localCDNStorage = localStorage.getItem(`localCDNs-${state.userCode}`)
          if (localCDNStorage.length > 0) {
            commit('loadStoredCDNs', localCDNStorage )
          } else {
              seedData = [{"name":"Locally Stored Library's","cdnVersion":"Notes","file":"This is where all the libraries that you have downloaded are stored"}]
          }
      }
  }
}

const getters = {
    localCDNStorage: state => state.localCDNs,
    ipAddress: state => state.ipAddress,
    progress: state => state.progress,
    currentFile: state => state.currentFile,
    userCode: state => state.userCode
  }

export default {
  state,
  mutations,
  actions,
  getters
}
