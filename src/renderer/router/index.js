import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue';
import Clipboard from 'v-clipboard'
import VueBar from 'vuebar';
import VueUp from'vueup';
import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import Wget from 'wget-improved';
import Prism from 'prismjs';
import bulmaToolTip from 'bulma-tooltip'
import vueBulmaToolTips from 'vue-bulma-tooltips'
vueBulmaToolTips.init(Vue)


Vue.use(VueBar)
Vue.use(Clipboard)
Vue.use(Router)
Vue.use(BootstrapVue)
Vue.use(VueUp)
Vue.use(Firebase)
Vue.use(Vuex)
Vue.use(Wget)
Vue.use(Prism)
Vue.use(VeeValidate,
  {
    classes: true,
    classNames: {
      valid: 'is-success',
      invalid: 'is-danger'
    }
  })


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
