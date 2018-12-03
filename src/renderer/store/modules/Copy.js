

const actions = {
  copyCDN({commit} , {cdn, clipboard, notify}) {
    var name = cdn.split('/').pop(),
    ext = cdn.split('.').pop(),
    link 
    ext === "js" ? link = `<script src="${cdn}"><\/script>`: 
    link = `<link rel="stylesheet" type="text/css" href="${cdn}">`
    clipboard(link); 
    commit('setNotification', `Copied script tag for: ${name} to your clipboard to be pasted into your webpage` ) //maybe in component?
  }
}


export default {
  actions
}
