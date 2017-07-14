<template>
  <div>
    
    <div class="row">
      <input type="text" class="input" v-model="search" placeholder="search for a CDN here"
       @keyup.enter="searchCDN"><i class="fa fa-search fa-2x"></i></input>
       
    <!--<button @click="searchCDN" >Search</button>-->
    </div>
  </div>
</template>

<script>
export default {
    data: function () {
        return {
            search: ''
        }
    },
    methods:{
        searchCDN () {
            this.$emit('searchCDN', this.search );
            this.search = '';
        }
    }
}
</script>

<style scoped>

body{
    margin-bottom: 10px;
}

.input {
    margin: 40px 100px 40px -100px;
    width: 400px;
    padding:20px;
    height: 40px;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-bottom: solid 2px blueviolet;
    font-family: 'Roboto Mono', monospace;
    position: absolute;
    left: 50%
}


div {
    
    font-family: 'Roboto Mono', monospace;
    font-size: 18px;
}

i {
    color:rgba(0,0,0,0.3);
    position: relative;
    margin-left: 450px;
    margin-top: 45px;
    top: 50;
}
</style>