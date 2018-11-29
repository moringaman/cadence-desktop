// import { copyOrLinkFile } from "electron-builder-util/out/fs";

// const state = {
    
// }

// const mutations = {

// }

const actions = {
  copyCDN({commit} , {cdn, clipboard, notify}) {
    console.log('CDN: ', cdn)
    var ext = cdn.split('.').pop();
    console.log('LINK: ', ext)
    var link 
    ext === "js" ? link = `<script src="${cdn}"><\/script>`: 
    link = `<link rel="stylesheet" type="text/css" href="${cdn}">`
   clipboard(link); 
    commit('setNotification', `Copied: ${link}` ) //maybe in component?
    console.log(ext);
  }
}

// const getters = {
  
// }

export default {
  // state,
  // mutations,
  actions,
  // getters
}
