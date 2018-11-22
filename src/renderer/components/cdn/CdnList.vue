<template>
<div> 
  
       <div  class="list" >       
    <app-cdn v-for=" (search,index) in searchData" :key="search.name"
      @click.native="copyCDN(index)">
     <div class="card">
         <div class="card-header">
             <p class="card-content header">
        {{search.name}}<span> ({{search.version}}) </span>
       </p> 
        <a class="card-header-icon" @click.prevent="copyCDN(index)" >
      <span class="icon" >
        <i class="fa fa-clipboard"></i>
      </span>
      </a>
      <a class="card-header-icon" >
       <span class="icon">
        <i class="fa fa-download"></i>
      </span>
    </a>
       </div>
       <div class="card-content">
           <div class="content">
       {{search.latest}}
       </div>
       </div>
       </div>
       
        </app-cdn>
       </div> 
     
     </div> 
</template>

<script>

import Cdn from './Cdn.vue'
export default {
    props: ['searchData'],
    data: function (){
        return {
            
        }
    },
    components: {
        appCdn: Cdn
    },
    methods: {
        copyCDN(index){
            this.$emit('cdnCopied', index);   
        },
        downloadSource(index) {
            console.log('downloading file')
        }
    }
}
</script>

<style scoped>
@import "~bulma/css/bulma.css";

body{
    margin-top: 200px;
    overflow-x: hidden;
    height: 100%;
}


</style>