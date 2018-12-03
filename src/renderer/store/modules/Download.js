const path = require('path')
const find = require('find')

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
      let localCDNStorage = localStorage.getItem('localCDNs') //.split(',')
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
  }
}

const actions = {
    downloadCDN({commit}, {cdn, cdnName, version, wget, notify}) {
        // return new Promise((resolve, reject) => {
            
        // })
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
                // TODO mutate current file state for reading by progress bar
            });
            download.on('start', function(fileSize) {
                console.log(fileSize);
                commit('setCurrentFile', file)
            });
            download.on('end', function(output) {
                console.log(output);

             commit('setLocalCDNs', {name, cdnVersion, file})
             // commit('setLocalCDNs', `${name} ${cdnVersion} http://localhost:9990/${file}` )
             let localCDNs = localStorage.setItem('localCDNs', JSON.stringify(state.localCDNs))
             // console.log("LocalCDNs: ", localCDNs)
              commit('setNotification', `Downloaded: ${file} for local use via http://localhost:9990`) 
              setTimeout(() => {
                  commit('clearNotification')
              }, 4000)
                // commit('setCurrentFile', '')
            });
            download.on('progress', function(progress) {
                typeof progress === 'number'
                console.log(progress)
                commit('updateProgress', progress)
                // code to show progress bar
            });

         } else {
            commit('setNotification', `${file} has already been downloaded - check your local storage `) 
            setTimeout(() => {
                commit('clearNotification')
            }, 4000)
         }
        })       
    //   console.log(ext);
  }
}

const getters = {
    //  searchData: state => state.searchData
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
