

const state = {
    showModal: false,
    modalMessage: '',
    modalResponse: 2,
    modalTitle: 'Please Confirm'
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
    },
    setModalTitle(state, payload) {
        state.modalTitle = payload
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
    modalResponse: state => state.modalResponse,
    modalTitle: state => state.modalTitle
}

export default {
    state,
    mutations,
    actions,
    getters
}