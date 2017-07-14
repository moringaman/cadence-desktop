import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue';
import Clipboard from 'v-clipboard'
import Notify from 'vue-notifyjs'
import VueBar from 'vuebar';
import VueUp from'vueup';
import Firebase from 'firebase';
import VueFire from'vuefire'

Vue.use(VueBar)
Vue.use(Clipboard)
Vue.use(Notify)
Vue.use(Router)
Vue.use(BootstrapVue)
Vue.use(VueUp)
Vue.use(Firebase)
Vue.use(VueFire)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: require('@/components/Home')
    },
    {
       path: '/cadence',
       name: 'cadence',
       component: require('@/components/Main')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
