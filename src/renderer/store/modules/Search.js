import axios from 'axios';
const Nucleus = require('electron-nucleus')('5c2fd2e8ffc1fb00ce9582e2')

const state = {
  searchData: [],
  lastSearchData: [],
  users: [],
  showHistory: false,
  showLocalStorage: true,
  dataLoading: false
}

const mutations = {
  loadSearchData(state, payload) {
    state.searchData = payload
    state.lastSearchData = payload
  
  },
  clearSearchData(state) {
    if (state.searchData > 0) {
      state.lastSearchData = state.searchData
    }
    state.searchData = []
  },
  toggleShowHistory(state, payload) {
    if (state.lastSearchData.length < 1) {
      state.lastSearchData = state.searchData
    }
    state.showHistory = payload
  },
  toggleShowLocalStorage(state, payload) {
    
    state.showLocalStorage = payload
    
  },
  toggleDataLoading(state) {
    state.dataLoading = !state.dataLoading
  },
  loadSearchHistory(state) {
    
      state.lastSearchData = payload
  
  }
}

const actions = {
  fetchSearchData({
    commit,
    dispatch
  }, search) {
    Nucleus.track(`Search`)
    // do something async
    commit('toggleShowLocalStorage', false)
    commit('loadSearchData', [])
    commit('toggleDataLoading')
    console.log(search)
    const URL = `https://api.cdnjs.com/libraries?search=`;
    axios.get(`${URL}${search}&fields=version,description`)
      .then((response) => {
        if (response.data.results.length < 1 || response.data.results.length > 300) {
          console.log('no results found')
          dispatch('notificationCtrl', {
            msg: 'No results were found using that search term, please try another',
            color: 'danger'
          })
          commit('toggleDataLoading')
        } else {
          let searchData = response.data.results;
          commit('clearSearchData')
          commit('toggleShowHistory', false)
          commit('showFavs', false)
          commit('toggleDataLoading')
          setTimeout(() => {
            commit('loadSearchData', searchData)
          }, 500)
          // localStorage.setItem('searchHistory', JSON.stringify(searchData))
          //  console.log(response);
          // commit('loadSearchHistory', localStorage.getItem('searchHistory'))
        }  
      })
      .catch(err => {
        console.log('ERR: ', err)
        return (Err ('failed'))
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