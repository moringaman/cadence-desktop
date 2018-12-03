import axios from 'axios';

const state = {
  searchData: [],
  lastSearchData: [],
  users: [],
  showHistory: false,
  showLocalStorage: true
}

const mutations = {
  loadSearchData (state, payload) {
    state.searchData = payload
    state.lastSearchData = payload
  },
  clearSearchData (state) {
    if (state.searchData < 0) {
      state.lastSearchData = state.searchData
    }
    state.searchData = []
  },
  toggleShowHistory (state, payload) {
    state.showHistory =  payload
  },
  toggleShowLocalStorage(state){
    state.showLocalStorage = !state.showLocalStorage
  }
}

const actions = {
  fetchSearchData ({ commit }, search) {
    // do something async
    commit('toggleShowLocalStorage')
    const URL = `https://api.cdnjs.com/libraries?search=`;
    axios.get(URL + search +'&fields=version,description')
    .then( (response) => {
      let searchData = response.data.results;
      commit('clearSearchData')
      commit('toggleShowHistory' ,false)
      commit('loadSearchData', searchData )
       console.log(response);
    })
    
  }
}

const getters = {
   searchData: state => state.searchData,
   lastSearchData: state => state.lastSearchData,
   showHistory: state => state.showHistory,
   showLocalStorage: state => state.showLocalStorage
}

export default {
  state,
  mutations,
  actions,
  getters
}
