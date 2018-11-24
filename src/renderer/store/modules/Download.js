const path = require('path')

const state = {
   localCDNs: [] //localStorage.getItem('localCDNs')
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
    let parsedObj = JSON.parse(localCDNStorage)
     for (var obj in parsedObj) {
         console.log(parsedObj[obj])
        state.localCDNs.push(parsedObj[obj])
    }
    // for(let i = 0; i< localCDNStorage.length; i++ ){
    //     if (localCDNStorage[i] !== null) {
    //         state.localCDNs.push(JSON.parse(localCDNStorage)[i])
    //     }
    // }
    //   state.localCDNs = localCDNStorage 
  }
}

const actions = {
    downloadCDN({commit}, {cdn, cdnName, version, wget, notify}) {
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
            let download = wget.download(cdn, output, options);
            download.on('error', function(err) {
                console.log(err);
            });
            download.on('start', function(fileSize) {
                console.log(fileSize);
            });
            download.on('end', function(output) {
                console.log(output);
            });
            download.on('progress', function(progress) {
                typeof progress === 'number'
                // code to show progress bar
            });
            
             commit('setLocalCDNs', {name, cdnVersion, file})
            // commit('setLocalCDNs', `${name} ${cdnVersion} http://localhost:9990/${file}` )
            let localCDNs = localStorage.setItem('localCDNs', JSON.stringify(state.localCDNs))
            console.log("LocalCDNs: ", localCDNs)

    // var ext = cdn.split('.').pop();
    // var link 
    // ext === "js" ? link = `<script type="txt/javascript" src="${cdn}"><\/script>`: 
    // link = `<link rel="stylesheet" type="text/css" href="${cdn}>`
//    clipboard(link); 
    notify({
        message: 'Copied: ' + cdn
      }); 
    //   console.log(ext);
  }
}

const getters = {
    //  searchData: state => state.searchData
    localCDNStorage: state => state.localCDNs
  }



export default {
  state,
  mutations,
  actions,
  getters
}
