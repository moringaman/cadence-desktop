<template>
<div>
    
    <div class="columns">    
  <div class="column is-2 side-bar">
    <app-menu></app-menu>
  </div>
    <div class="column">
      <app-header @searchCDN="fetchData"></app-header>    
      <!-- <div class="scroll-list"> -->
        <div class="main-logo" v-if="searchData.length == 0"><img src="../././assets/logo2.svg">
        <br><span><p>Search for any Available CND for your project</p></span></div>
         <div v-show="!searchData.length == 0" class="scroll-list" v-bar="{preventParentScroll:true}">
    <app-cdn-list :searchData="searchData" @cdnCopied='copyCDN'></app-cdn-list>   
      </div>
<notifications class="alert"></notifications>
      
    </div>
     <app-footer>test</app-footer> 
    </div>
  
</div>
</template>

<script>
const URL = `https://api.cdnjs.com/libraries?search=`;
import axios from 'axios';
import Header from './cdn/Header.vue';
import CdnList from './cdn/CdnList.vue';
import Menu from './cdn/Menu.vue';
import Footer from './cdn/Footer.vue';

export default {
  
  data: function (){
  return {
      searchData: []
  }
  },
  components: {
        appCdnList: CdnList,
        appHeader: Header,
        appMenu: Menu,
        appFooter: Footer,
  },
  methods: {
    fetchData (search){
      axios.get(URL + search +'&fields=version,description')
      .then( (response) => {
        this.searchData = response.data.results;
         console.log(response);
      })
    },
    copyCDN (index){
     var  cdn  = this.searchData[index].latest;
     var ext = cdn.split('.').pop();
     var link 
     ext === "js" ? link = `<script type="txt/javascript" src="${cdn}"><\/script>`: 
     link = `<link rel="stylesheet" type="text/css" href="${cdn}>`
    this.$clipboard(link); 
    this.$notify({
        message: 'Copied: ' + link
      }); 
      console.log(ext);
    }
  }
}
</script>

<style>

@import "/vue-notifyjs/themes/default.css";

html{
   /* min-height:100%;/* make sure it is at least as tall as the viewport */
   
   /* background: url('./assets/background.png');
    opacity: 0.2;*/
    overflow: hidden;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

body {
  
  height: 100%;
  margin: 0px;
  background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
   overflow: hidden;   
  font-family: 'Roboto Mono', monospace;
  
}

.side-bar {
  background-color:rgba(0,0,0, 0.2);
  text-align:center;
  width: 60%;
  margin-right: 30px;
  z-index: 50;
  height: 99.25vh; 
  
}


div {
  text-align: center;
  
}

p {
  color:rgba(0,0,0, 0.2);
}

.scroll-list {
  margin-top: 50px;
  margin-bottom: 40px;
  height: 550px;
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

.main-logo span{
 
  opacity: 1;
}

.alert {
  width: 90%;
  background-color: lightgreen;
  border-radius: 5px;
  color: #fff;
  z-index: 99;
  margin-bottom: 100px;
  position: absolute;
  right: 10px;
}

.alert button {
  background: transparent;
  border: 0px;
  position: relative;
  visibility: hidden;
}



.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
