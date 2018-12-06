<template>
  <div>
    
    <div class="row">
      <input type="text" class="input" v-model="search" placeholder="search for a CDN here and press ENTER"
       @keyup.enter="searchCDN"/><div class='btn-search' :class='{active: searchEnabled}' @click="searchCDN">SEARCH<i class="fa fa-search"></i></div>
    </div>
  </div>
</template>

<script>
export default {
    data: function () {
        return {
            search: '',
            searchEnabled: false
        }
    },
    methods:{
        searchCDN () {
            if (this.searchEnabled) {
                this.$emit('searchCDN', this.search );
                this.search = '';
            } else {
                this.$store.commit('setNotification', 'please enter a search term of over 3 letters')
                setTimeout(() => {
                    this.$store.commit('clearNotification')
                }, 4000)
            }
        }
    },
    watch: {
        search(val) {
            val.length > 2? this.searchEnabled = true: this.searchEnabled = false
        }
    }
}
</script>

<style scoped>

body{
    margin-bottom: 10px;
}

.input {
    margin: 40px 100px 50px -100px;
    width: 400px;
    padding:20px;
    height: 40px;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-bottom: solid 2px blueviolet;
    font-family: 'Roboto Mono', monospace;
    position: absolute;
    left: 50%;
    transform: translateX(-15%)
}

.btn-search {
    position: relative;
    width: 120px;
    padding: 8px 10px;
    margin-left: 65%;
    margin-top: 15px;
    margin-bottom: 65px;
    background-color: blueviolet;
    color: white;
    opacity: .5;
    border-radius: 3px;
    transform: translateY(40px);
    cursor: pointer;
}

.active {
    opacity: .8;
}


div {
    
    font-family: 'Roboto Mono', monospace;
    font-size: 18px;
}

i {
    color:white;
    position: relative;
    margin-left: 10px;
    display: inline;
    /* margin-left: 450px;
    margin-top: 45px;
    top: 50; */
}
</style>