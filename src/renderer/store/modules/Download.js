const path = require('path')
const find = require('find')
const fs = require('fs')

const state = {
   localCDNs: [], //localStorage.getItem('localCDNs')
   ipAddress: '127.0.0.1',
   progress: 0,
   currentFile: ''
}

const mutations = {
  setLocalCDNs(state, payload) {
    //   let {name, cdnVersion, file} = payload
    //   let cdnObj = {cdnName, cdnVersion, file}
         let cdnObj = payload
         console.log('PASSED', cdnObj)
        state.localCDNs.push(payload)
  },
  loadStoredCNs(state) {
      let localCDNStorage = localStorage.getItem('localCDNs') //FIXME: 'localCDNs' + UID
    //   console.log('localStorage', JSON.parse(localCDNStorage))
    console.log(JSON.parse(localCDNStorage))
    // if (state.localCNDs.length > 0) {
    let parsedObj = JSON.parse(localCDNStorage)
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
  }
}

const actions = {
    downloadCDN({commit, state, dispatch}, {cdn, cdnName, version, wget, notify}) {
        if (state.online === false) {
            dispatch('notificationCtrl', {msg: "Download of library failed - NETWORK ERROR", color: 'danger'})
            return
        }
        const src = cdn;
        let name = cdnName
        let cdnVersion = version
        const file = cdn.split('/').splice('-1' )[0]
        console.log('FILE: ',file);
        const downloadPath = path.join(__dirname, '../..', 'public')
        console.log(path.join(__dirname, '../..', 'public') )
        const output = downloadPath + '/' + file;
        const options = {
            // see options below
         };
        let fileExists = false
         find.file(/\.js$/, downloadPath, (files) => {
             console.log(files)
             for (let i=0; i<files.length; i++){
                if (files[i] === `src/renderer/public/${file}`) {
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
             // commit('setLocalCDNs', `${name} ${cdnVersion} http://localhost:9990/${file}` )
             localStorage.setItem('localCDNs', JSON.stringify(state.localCDNs)) //FIXME: 'localCDNs' + UID
             // console.log("LocalCDNs: ", localCDNs)
              dispatch('notificationCtrl', {msg: `Downloaded: ${file} for local use via http://localhost:9990`, color: 'success'}) 
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
    const downloadPath = path.join(__dirname, '../..', 'public')
    console.log('file to delete: ', payload)
    fs.unlink(`${downloadPath}/${payload}`, (err) => {
        if (err) throw err;
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
  }
}

const getters = {
    localCDNStorage: state => state.localCDNs,
    ipAddress: state => state.ipAddress,
    progress: state => state.progress,
    currentFile: state => state.currentFile
  }

export default {
  state,
  mutations,
  actions,
  getters
}
