<template>
<div> 
       <div  class="list" >       
    <app-cdn  v-for=" (search,index) in searchData" :key="search.name"
      @click.native="copyCDN(index)" :Data='search'>
        </app-cdn>
        <app-cdn  v-for=" (search,index) in localCDNStorage" :key="search.name"
      @click.native="copyCDN(index)" :Data='search'>
        </app-cdn>
       </div> 
     
     </div> 
</template>

<script>

import Cdn from './Cdn.vue'
export default {
    props: ['searchData', 'localCDNStorage'],
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