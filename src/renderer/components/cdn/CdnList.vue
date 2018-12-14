<template>
<div> 
    <p class='result-count' v-if='searchData'>{{searchData.length}} results found 
        <span v-if='searchData.length > 4'>Scroll down for more</span>
    </p>
       <div  class="list" >       
    <app-cdn  v-for=" (search,index) in searchData" :key="search.name"
      @click.native="copyCDN(index)" :Data='search'>
        </app-cdn>
        <app-cdn v-if='showLocalStorage' v-for=" (search,index) in localCDNStorage" :key="search.file"
      @click.native="copyCDN(index)" :Data='search'>
        </app-cdn>
       </div> 
     
     </div> 
</template>

<script>
import { mapGetters } from 'vuex'
import Cdn from './Cdn.vue'
export default {
    props: ['searchData', 'localCDNStorage'],
    data: function (){
        return {
            refresh: false
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
    },
    computed: {
        ...mapGetters([
            'showLocalStorage'
        ])
    },
    watch: {
        searchData() {
            console.log('new data sent')
            this.refresh = true
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