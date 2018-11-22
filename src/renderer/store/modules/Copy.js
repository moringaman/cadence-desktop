

const state = {
  
}

const mutations = {
 
}

const actions = {
  copyCDN(state, {cdn, clipboard, notify}) {
    
    var ext = cdn.split('.').pop();
    var link 
    ext === "js" ? link = `<script type="txt/javascript" src="${cdn}"><\/script>`: 
    link = `<link rel="stylesheet" type="text/css" href="${cdn}>`
   clipboard(link); 
    notify({
        message: 'Copied: ' + link
      }); 
      console.log(ext);
  }
}

const getters = {
  //  searchData: state => state.searchData
}

export default {
  state,
  mutations,
  actions,
  getters
}
