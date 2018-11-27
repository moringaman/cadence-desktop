import axios from 'axios';

const state = {
  searchData: [],
  lastSearchData: [],
  users: [],
  showHistory: false
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
  }
}

const actions = {
  fetchSearchData ({ commit }, search) {
    // do something async
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
   showHistory: state => state.showHistory
}

export default {
  state,
  mutations,
  actions,
  getters
}
