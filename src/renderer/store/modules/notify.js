import axios from 'axios'

const state = {
    notification: ' '
}

const mutations = {
    setNotification(state, payload) {
        state.notification = payload
      },
      clearNotification(state) {
        state.notification = ' '
      }
}

const actions = {

}

const getters = {
    notification: state => state.notification
}

export default {
    state,
    mutations,
    actions,
    getters
}