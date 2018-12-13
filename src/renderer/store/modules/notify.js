

const state = {
    notification: ' ',
    
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
    notificationCtrl({commit}, payload) {
        let { timeOut = 4000 } = payload
        commit('setNotification', payload)
            setTimeout(() => {
                commit('clearNotification')
            }, timeOut)
    }
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