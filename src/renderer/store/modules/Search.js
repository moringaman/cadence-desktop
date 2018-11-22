import axios from 'axios';

const state = {
  searchData: [],
  users: []
}

const mutations = {
  loadSearchData (state, payload) {
    state.searchData = payload
  },
  clearSearchData (state) {
    state.searchData = []
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
      commit('loadSearchData', searchData )
       console.log(response);
    })
    
  }
}

const getters = {
   searchData: state => state.searchData
}

export default {
  state,
  mutations,
  actions,
  getters
}
