<template>
    <div class="list-view">
      <div class="card">
         <div class="card-header">  
             <p class="card-content header">
        {{Data.name}}<span> ({{Data.version}} {{Data.cdnVersion}}) </span>
       </p>
          <a class="card-header-icon" >
      <span class="icon" @click="favoriteCDN()">
        <i class="fa fa-heart"></i>
      </span>
      </a> 
        <a class="card-header-icon" >
      <span class="icon" @click="copyCDN()">
        <i class="fa fa-clipboard"></i>
      </span>
      </a>
      <a v-if='searchData.length > 1' class="card-header-icon" >
       <span class="icon" @click='downloadCDN()'>
        <i  class="fa fa-download"></i>
      </span>
    </a>
       </div>
       <div class="card-content">
           <div class="content">
       {{Data.latest}}<span v-if='searchData.length < 1'>http://localhost:9990/</span>{{Data.file}}
       </div>
       </div>
       </div>
  </div>
</template>

<script>
import wget from 'wget-improved';
import { mapGetters, mapMutations } from 'vuex'

export default {
    props: ['Data'],

methods: {
    copyCDN (index){
        if (this.Data.latest){
            var  cdn  = this.Data.latest;
        } 
        else {
            var cdn = `http://localhost:9990/${this.Data.file}`
        }
      let clipboard = this.$clipboard
      let notify = this.$notify
      this.$store.dispatch('copyCDN', { cdn, clipboard, notify })
      setTimeout(() => {
       this.$store.commit('clearNotification')// TODO call clear mutuation
    }, 3000)
    },
    downloadCDN () {
        // let wget = this.wget
        // let {cdnName, cdn, version} = this.Data
        console.log("wget: ", wget)
         let cdnName = this.Data.name
         let version = this.Data.version
         var  cdn  = this.Data.latest;
         let notify = this.$notify
        this.$store.dispatch('downloadCDN', {wget, cdn, cdnName, version, notify })
        setTimeout(() => {
       this.$store.commit('clearNotification')// TODO call clear mutuation
    }, 3000)
    },
    ...mapMutations([
        'clearNotification'
    ])
},
computed: {
    ...mapGetters([
        'searchData'
    ])
},
ceated() {
    console.log(this.Data)
}
}

</script>

<style>

@import "~bulma/css/bulma.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";


body {
    overflow-x: hidden;
}

div {
    
    font-family: 'Roboto Mono', monospace;
    font-size: 18px;
}

.card {
    margin: 20px 5%;
    cursor: pointer;
    background-color: #ffffff;
    width:800px;
      
}

.card-content {
    opacity: 0.5;  
}

.content {
    overflow-wrap:break-word;
}

.card-content.header {
    text-align: center;
    padding: 10px;
    padding-left: 90px;
    width: 95%;
    font-size: 24px;
    font-weight: bold;
    opacity: 0.7;
    color:black;
}

.card-content.header span {
    font-weight:normal;
    font-size: 18px;
}

.card-content.header:hover {
    background-color: blueviolet;
    color:#ffffff;
    opacity: 0.6;
}

.card-header-icon {
    align-self: right;
}

.card-header-icon:hover {
    color: blueviolet;
}

.card:hover{
    
   /* background-color: rgba(0,0,0, 0.2);*/
    color: #ffffff;
}

h3 {
    font-weight: bold;
}



.list-view {
    overflow-x: hidden;
}

</style>