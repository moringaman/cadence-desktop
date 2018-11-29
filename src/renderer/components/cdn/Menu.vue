<template>
<div>
    <div class="logo"><img src="../../assets/logo2.svg">Cadence
    </div>
    <ul style="display: block">
        <li class="nav-item"><i class="fa fa-heart fa-3x"></i></li>
        <li class="nav-item" @click='clearSearch()'><i class="fa fa-download fa-3x"></i></li>
        <li class="nav-item" @click='showHistory()'><i class="fa fa-history fa-3x"></i></li>
        <li class="nav-item"><i class="fa fa-thumbs-o-up fa-3x"></i></li>
        <!-- <li ><router-link to='/'> <i class="fa fa-sign-out fa-3x"></i></router-link></li> -->
        <li @click='signOut' > <i class="fa fa-sign-out fa-3x"></i></li>
        </ul>
     
    </div>
</template>

<script>

 import { mapActions } from 'vuex';

export default {
   
methods: {
     ...mapActions([
        'clearSearchData',
        'signOut'
    ]),
    clearSearch() {
        this.$store.commit('toggleShowHistory', false)
        this.$store.commit('clearSearchData')
    },
    showHistory() {
        // this.$store.commit('clearSearchData')
        this.$store.commit('toggleShowHistory', true)
    }
},
}
</script>

<style>

@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

.logo {
    padding: 30px 50px 10px;
   /* background-color: rgba(0,0,0, 0.2);*/
    background-color: rgba(255,242,0, .7);
    color: #fff;
    margin-left: -15px;
    margin-right: -25px;
    font-family: 'Roboto Mono', monospace;
    font-size: 28px;
    margin-bottom: 50px;
    -webkit-app-region: drag;
    
}

.logo img {
    width: 50%;
}



li i {
    outline: none;
    margin: 20px auto;
    width: 50px;
    color: grey; 
    opacity: 0.5;
    vertical-align: middle;
}

li i:hover {
    color: blueviolet;
}

.fa {
    font-size: 50px;
    text-align: center;
    vertical-align: top;
}


</style>