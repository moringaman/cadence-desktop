import axios from 'axios';

const state = {
  searchData: [],
  lastSearchData: [],
  users: [],
  showHistory: false,
  showLocalStorage: true,
  dataLoading: false
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
    if (state.lastSearchData.length < 1) {
      state.lastSearchData = state.searchData
    }
    state.showHistory =  payload
  },
  toggleShowLocalStorage(state, payload){
    state.showLocalStorage = payload
  },
  toggleDataLoading(state) {
    state.dataLoading = !state.dataLoading
  }
}

const actions = {
  fetchSearchData ({ commit }, search) {
    // do something async
    commit('toggleShowLocalStorage', false)
    commit('loadSearchData', [])
    commit('toggleDataLoading')
    const URL = `https://api.cdnjs.com/libraries?search=`;
    axios.get(URL + search +'&fields=version,description')
    .then( (response) => {
      let searchData = response.data.results;
      commit('clearSearchData')
      commit('toggleShowHistory' ,false)
      commit('showFavs' ,false)
      commit('toggleDataLoading')
      setTimeout(()=>{
        commit('loadSearchData', searchData )
      }, 500)
      
      //  console.log(response);
    })
    
  }
}

const getters = {
   searchData: state => state.searchData,
   lastSearchData: state => state.lastSearchData,
   showHistory: state => state.showHistory,
   showLocalStorage: state => state.showLocalStorage,
   dataLoading: state => state.dataLoading
}

export default {
  state,
  mutations,
  actions,
  getters
}
