import Vue from 'vue'
import axios from 'axios'
import 'bulma/css/bulma.css'
// import tooltip from 'bulma-tooltip'
import App from './App'
import router from './router'
import store from './store'

const { fork } = require('child_process')
const ps = fork(`${__dirname}/server.js`)


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
// Vue.use(tooltip)
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
