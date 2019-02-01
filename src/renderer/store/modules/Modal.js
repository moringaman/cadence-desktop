

const state = {
    showModal: false,
    modalMessage: 'Are you sure you want to do this',
    modalResponse: 2
}

const mutations = {
    hideModal(state, payload) {
        state.showModal = false
        state.modalResponse = payload
    },
    setModalMessage(state, payload) {
        state.modalMessage = payload
    },
    shoModal(state) {
        state.showModal = true
    },
    resetModal(state) {
        state.modalResponse = 2
    }
}

const actions = {
    hideModal({state, commit}, payload) {
        commit('hideModal', payload)
        return false
    },
    confirmOperation({commit}, payload) {
        commit('hideModal', payload)
        return true
    },
    showModal({state, commit}, payload) {
        commit('shoModal')
        commit('setModalMessage', payload.message)
    }
}

const getters = {
    showModal: state => state.showModal,
    modalMessage: state=> state.modalMessage,
    modalResponse: state => state.modalResponse
}

export default {
    state,
    mutations,
    actions,
    getters
}