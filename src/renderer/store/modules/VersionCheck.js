let currentVersion = "1.0.1" // Current app version matching package,json version

const Octokit = require('@octokit/rest')
let octokit = new Octokit({
  auth: 'token e86a3eecc1363558c5edf6a352efbe666acf6d81'
})


const state = {
  version: '',
  update: false,
  newVersion: ''
}

const mutations = {
   requestUpdate(state) {
     state.update = true
   },
   currVersion(state, payload) {
     state.version = payload
   },
   newVersion(state, payload) {
     state.newVersion = payload
   } 
}

const actions = {
  getVersion({commit}) {
    commit('currVersion', currentVersion)
    octokit.request('GET /repos/:owner/:repo/releases', {owner: 'moringaman', repo: 'cadence-desktop'})
    .then(release => { 
      let version = release.data[0].tag_name  
      commit('newVersion', version)
      if (version != `v${currentVersion}`) {
        commit('requestUpdate')
      }
    })
  }
}

const getters = {
  version: state => state.version,
  update: state => state.update
}

export default {
    state,
    mutations,
    actions,
    getters
}
