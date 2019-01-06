<template>
  <div>
    <div class="columns">
      <div class="column is-2 side-bar">
        <app-menu></app-menu>
      </div>
      <div class="column list-space">
        <app-header @searchCDN="fetchData"></app-header>
        <!-- <div class="scroll-list"> -->
        <div class="main-logo" v-if="searchData.length < 1 && localCDNStorage.length === 0 && favs.length == 0"><img src="../././assets/logo2.svg">
          <br><span><p>Search for any Available CND for your project</p></span></div>
          <app-loading-bar v-if='dataLoading===true'></app-loading-bar>
        <template v-if='!showHistory && !showFavs'>
           <div v-if="!searchData.length == 0" class="scroll-list"  v-bar="{resizeRefresh:true, preventParentScroll:true}">
      <app-cdn-list :searchData="searchData" :localCDNStorage="localCDNStorage"/> 
        </div>
             <div v-if="localCDNStorage.length > 0 && searchData.length == 0 " class="scroll-list" v-bar="{resizeRefresh: false, preventParentScroll:false}">
      <app-cdn-list :localCDNStorage="localCDNStorage"></app-cdn-list>   
        </div>
</template>
<template v-if='showFavs'>
  <div v-if="favs.length > 0" class="scroll-list" v-bar="{preventParentScroll:true, useScrollbarPseudo:true}">
    <app-cdn-list :searchData="favs"></app-cdn-list>
  </div>
</template>

<template v-if='showHistory && !showFavs'>
  <div v-if="localCDNStorage.length > 0 && searchData.length == 0 " class="scroll-list" v-bar="{preventParentScroll:true, useScrollbarPseudo:true}">
    <app-cdn-list :searchData="lastSearchData"></app-cdn-list>
  </div>
</template>
      <div class='local-count' v-if='localCDNStorage.length > 0 && searchData.length < 1'>
      <p>You have {{ localCDNStorage.length }} CDN's available for use offline</p>
      </div>

  
      <app-notify :notification='notification'/>
    <div class='ad-space' v-if="!loggedIn"><h3>YOUR AD HERE</h3></div>
    <p class="ad-msg" v-if="!loggedIn">Please <a linkTo='#'>Donate</a> to remove ads and unlock new features</p>
      </div>      
    </div>
     <app-footer></app-footer> 
    </div>
  
</div>
</template>

<script>
  const URL = `https://api.cdnjs.com/libraries?search=`;
  import axios from 'axios';
  import wget from 'wget-improved';
  import os from 'os';
  import Header from './cdn/Header.vue';
  import CdnList from './cdn/CdnList.vue';
  import Menu from './cdn/Menu.vue';
  import Footer from './cdn/Footer.vue';
  import Notify from './helpers/Notify.vue'
  import loadingBar from './helpers/loading.vue'
  import vuebar from 'vuebar'

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
        // ipAddress: '',
        userCode: ''
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
        'dataLoading',
        'online'
        
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
      //TODO: Initialize app - add localCDN & favourite (vuejs)
      const userId = this.currentUser
      this.getIp()
      if (this.loggedIn === false && this.basicUser === false) {
        this.$router.push('/')
      }
      console.log('fetching favourites')
      if (this.currentUser != '' && this.loggedIn === true) {
        this.userCode = userId.split('').splice(0,9).join('')
        this.$store.commit('setUserCode', this.userCode )
        if ( localStorage.getItem(`localCDNs-${this.userCode}`) !== null && this.localCDNStorage.length === 0) {
          // this.$store.commit('loadStoredCDNs')
          this.$store.dispatch('getCDNs', {wget, userId})
        } 
         console.log(localStorage.getItem(`localCDNs-${this.userCode}`))
        // this.$store.dispatch('getFavs', this.currentUser)
        this.$store.dispatch('getFavs', {uid: userId, userCode: this.userCode, online: this.online})
      } else {
          // TODO: Load favourites from local storage if offline or not logged in
           this.$store.dispatch('getFavs')
          // this.$store.commit('loadSearchHistory')
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
    max-height:100vh;
    margin: 0px;
    background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
    overflow: hidden;
    font-family: 'Roboto Mono', monospace;
  }

  .ad-msg {
    transform: translateX(-27px);
    font-size: .95rem;
    margin-top: 10px;
  }

  .ad-space {
    height: 90px;
    width: 500px;
    /* border: 1px solid gray; */
    background-color: white;
    margin: 0px auto;
    transform: translateX(-31px);
  }

  .ad-space > h3 {
    
  }
  
  .server-message>p {
    position: absolute;
    display: inline;
    color: gray;
    left: 55%;
    bottom: 100px;
    transform: translateX(-45%);
  }
  
  /* .fa-cog__1 {
    position: absolute;
    opacity: .3;
    color: #333;
    bottom: 50px;
    left: 55%;
    animation: rotate 5s linear infinite;
  } */
  
  /* .fa-cog__2 {
    position: absolute;
    opacity: .3;
    color: #333;
    bottom: 43px;
    left: 57.5%;
    animation: rotate 5s linear reverse infinite;
  } */
  
  .local-count>p {
    position: absolute;
    color: blueviolet;
    bottom: 50px;
    left: 55%;
    transform: translateX(-45%);
  }
  
  .side-bar {
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 60%;
    margin-right: 30px;
    z-index: 50;
    height: 55.3rem;
  }
  
  div {
    text-align: center;
  }
  
  p {
    color: rgba(0, 0, 0, 0.2);
  }

  .list-space {
    margin: 0px auto;
  }
  
  .scroll-list {
    margin-top: 50px;
    margin-bottom: 40px;
    height: 36rem;
    width: 57rem;
    z-index: 99;
    transform: translateX(-30px);
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
