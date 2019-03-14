

const actions = {
  copyCDN({dispatch} , {cdn, clipboard, origin = null}) {
    var name = cdn.split('/').pop(),
    ext = cdn.split('.').pop(),
    link 
    ext === "js" ? link = `<script src="${cdn}"><\/script>`: 
    link = `<link rel="stylesheet" type="text/css" href="${cdn}">`
    if (origin != null) {
      let scriptTag = `<script>
      if (navigator.onLine) {
        document.write('<script src="${origin}">\x3C/script>')
      } else {
        document.write('<script src="${cdn}">\x3C/script>')
      }
      </script>`
      clipboard(scriptTag)
      dispatch('notificationCtrl', { msg:`Copied script tag for: ${name} to your clipboard to be pasted into your webpage`, color: 'success'} ) //maybe in component?
    } else {
      clipboard(link); 
    dispatch('notificationCtrl', { msg:`Copied script tag for: ${name} to your clipboard to be pasted into your webpage`, color: 'success'} ) //maybe in component?
    }
  }
}


export default {
  actions
}
