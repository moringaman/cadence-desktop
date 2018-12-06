<template>
  <div>
  
    <div class="columns">
      <div class="column is-2 side-bar">
        <app-menu></app-menu>
      </div>
      <div class="column">
        <app-header @searchCDN="fetchData"></app-header>
        <!-- <div class="scroll-list"> -->
        <div class="main-logo" v-if="searchData.length == 0 && localCDNStorage.length === 0"><img src="../././assets/logo2.svg">
          <br><span><p>Search for any Available CND for your project</p></span></div>
          <app-loading-bar v-if='dataLoading===true'></app-loading-bar>
        <template v-if='!showHistory && !showFavs'>
           <div v-if="!searchData.length == 0" class="scroll-list" v-bar="{preventParentScroll:true}">
      <app-cdn-list :searchData="searchData" :localCDNStorage="localCDNStorage"></app-cdn-list>   
        </div>
             <div v-if="localCDNStorage.length > 0 && searchData.length == 0 " class="scroll-list" v-bar="{preventParentScroll:true}">
      <app-cdn-list :localCDNStorage="localCDNStorage"></app-cdn-list>   
        </div>
</template>
<template v-if='showFavs'>
  <div v-if="favs.length > 0" class="scroll-list" v-bar="{preventParentScroll:true}">
    <app-cdn-list :searchData="favs"></app-cdn-list>
  </div>
</template>

<template v-if='showHistory && !showFavs'>
  <div v-if="localCDNStorage.length > 0 && searchData.length == 0 " class="scroll-list" v-bar="{preventParentScroll:true}">
    <app-cdn-list :searchData="lastSearchData"></app-cdn-list>
  </div>
</template>
      <div class='local-count' v-if='localCDNStorage.length > 0 && searchData.length < 1'>
      <p>You have {{ localCDNStorage.length }} CDN's available for use offline</p>
      </div>

  
      <app-notify :notification='notification'/>
     
      <div class="server-message">
        <p>Local CDN Server running at http://localhost:9990 or http://{{ipAddress}}:9990</p>
        <i class='fa fa-cog  fa-cog__1 fa-2x'></i>
        <i class='fa fa-cog  fa-cog__2 fa-2x'></i>
        </div>
      
    </div>
     <app-footer></app-footer> 
    </div>
  
</div>
</template>

<script>
  const URL = `https://api.cdnjs.com/libraries?search=`;
  import axios from 'axios';
  import os from 'os';
  import Header from './cdn/Header.vue';
  import CdnList from './cdn/CdnList.vue';
  import Menu from './cdn/Menu.vue';
  import Footer from './cdn/Footer.vue';
  import Notify from './helpers/Notify.vue'
  import loadingBar from './helpers/loading.vue'

  import {
    mapActions,
    mapGetters,
    mapMutations
  } from 'vuex'
  import {
    FILE
  } from 'dns';
  
  export default {
  
    data: function() {
      return {
        // ipAddress: ''
      }
    },
    components: {
      appCdnList: CdnList,
      appHeader: Header,
      appMenu: Menu,
      appFooter: Footer,
      appNotify: Notify,
      appLoadingBar: loadingBar
    },
    methods: {
      ...mapActions([
        'fetchSearchData',
        'getFavs'
      ]),
      ...mapMutations([
        'loadStoredCNs'
      ]),
      fetchData(search) {
        this.$store.dispatch('fetchSearchData', search)
      },
      getIp() {
        var ifaces = os.networkInterfaces();
        let self = this
        Object.keys(ifaces).forEach(function(ifname) {
          var alias = 0;
          ifaces[ifname].forEach(function(iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }
            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              console.log(ifname + ':' + alias, iface.address);
            } else {
              // this interface has only one ipv4 adress
              // self.ipAddress = iface.address
              self.$store.commit('setIpAddress', iface.address)
              console.log(ifname, iface.address);
            }
            ++alias;
          });
        }) //.bind(self.$store);
      }
    },
    computed: {
      ...mapGetters([
        'searchData',
        'lastSearchData',
        'localCDNStorage',
        'notification',
        'showHistory',
        'ipAddress',
        'loggedIn',
        'basicUser',
        'currentUser',
        'favs',
        'showFavs',
        'dataLoading'
      ])
    },
    watch: {
      loggedIn: function() {
        if (this.loggedIn === false || this.basicUser === false) {
          this.$router.push('/')
        }
      }
    },
    created() {
      if (localStorage.getItem('localCDNs') !== null && this.localCDNStorage.length === 0) this.$store.commit('loadStoredCNs')
      console.log(localStorage.getItem('localCDNs'))
      this.getIp()
      if (this.loggedIn === false && this.basicUser === false) {
        this.$router.push('/')
      }
      console.log('fetching favourites')
  
      // this.$store.dispatch('addFav', this.currentUser)
  
      if (this.currentUser != '' && this.loggedIn === true) {
        // TODO: Load favourites from local storage if offline
        this.$store.dispatch('getFavs', this.currentUser)
      }
    }
  }
</script>

<style>
  @import "https://unpkg.com/vue-notifyjs/themes/default.css";

  html {
    /* min-height:100%;/* make sure it is at least as tall as the viewport */
    /* background: url('./assets/background.png');
      opacity: 0.2;*/
    overflow: hidden;
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
  }
  
  body {
    max-height: 100%;
    margin: 0px;
    background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
    overflow: hidden;
    font-family: 'Roboto Mono', monospace;
  }
  
  .server-message>p {
    position: absolute;
    display: inline;
    color: gray;
    left: 55%;
    bottom: 100px;
    transform: translateX(-45%);
  }
  
  .fa-cog__1 {
    position: absolute;
    opacity: .3;
    color: #333;
    bottom: 50px;
    left: 55%;
    animation: rotate 5s linear infinite;
    /* text-shadow: 2px 2px 2px rgba(0,0,0, 0.2); */
  }
  
  .fa-cog__2 {
    position: absolute;
    opacity: .3;
    color: #333;
    bottom: 43px;
    left: 57.5%;
    animation: rotate 5s linear reverse infinite;
    /* text-shadow: 2px 2px 2px rgba(0,0,0, 0.2); */
  }
  
  .local-count>p {
    position: absolute;
    ;
    color: blueviolet;
    bottom: 150px;
    left: 55%;
    transform: translateX(-45%);
  }
  
  .side-bar {
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 60%;
    margin-right: 30px;
    z-index: 50;
    height: 99.25vh;
  }
  
  div {
    text-align: center;
  }
  
  p {
    color: rgba(0, 0, 0, 0.2);
  }
  
  .scroll-list {
    margin-top: 50px;
    margin-bottom: 40px;
    height: 570px;
    width: 99%;
    z-index: 99;
  }
  
  .main-logo img {
    margin-top: 200px;
    margin-bottom: 50px;
    height: 200px;
    opacity: 0.1;
    overflow-y: hidden;
    z-index: 1;
  }
  
  .main-logo span {
    opacity: 1;
  }

  .loader {
    
    margin-top: 30%;
    margin-left: 50%;
    
  }
  
  .alert {
    width: 90%;
    background-color: lightgreen;
    border-radius: 5px;
    color: #fff;
    z-index: 99;
    bottom: 100px;
    position: absolute;
    right: 10px;
  }
  
  .alert button {
    background: transparent;
    border: 0px;
    position: relative;
    visibility: hidden;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }
  
  .fade-enter,
  .fade-leave-to
  /* .fade-leave-active in <2.1.8 */
  
  {
    opacity: 0
  }
  
  
  /* Animations and transitions */
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
