<template>
<div>
    <div class="logo"><img src="../../assets/logo2.svg">Cadence
    </div>
    <ul style="display: block">
        <app-menu-item fa-icon='fa fa-heart fa-3x' item-name='Favorites' event-name="showFavs" @showFavs='showFav' :class="{active:showFavs}" />
        <app-menu-item fa-icon='fa fa-download fa-3x' item-name='local Storage' event-name="clear" @clear='clearSearch' :class="{active:showLocalStorage}"/>
        <app-menu-item fa-icon='fa fa-history fa-3x' item-name='history' event-name="history" @history='shoHistory' :class="{active:showHistory}"/>
        <app-menu-item fa-icon='fa fa-thumbs-o-up fa-3x' item-name='popular' event-name="popular" @popular='popular' />
        <li class="nav-item" @click='signOut()'> <i class="fa fa-sign-out fa-3x"></i><span>LEAVE</span></li>
        </ul>
    </div>
</template>

<script>

 import { mapActions, mapGetters } from 'vuex';
 import menuItem from './MenuItem.vue'

export default {
   components: {appMenuItem: menuItem},
   data() {
       return {
        //    showFavs: false
       }
   },
   computed: {
     ...mapGetters([
        'showFavs',
        'showHistory',
        'showLocalStorage'
    ])
},
    methods: {
        ...mapActions([
            'clearSearchData',
            'signOut'
        ]),
   
    clearSearch() {
        this.$store.commit('toggleShowHistory', false)
        this.$store.commit('showFavs', false)
        this.$store.commit('clearSearchData')
        this.$store.commit('toggleShowLocalStorage', true)
    },
    shoHistory() {
         this.$store.commit('clearSearchData')
        this.$store.commit('toggleShowHistory', true)
        this.$store.commit('showFavs', false)
        this.$store.commit('toggleShowLocalStorage', false)
    },
    popular() {
        console.log('clicked popular item')

    },
    showFav(){
        this.$store.commit('clearSearchData')
        this.$store.commit('showFavs', true)
         this.$store.commit('toggleShowLocalStorage', false)
         this.$store.commit('toggleShowHistory', false)
        //  this.showFavs = this.$store.getters.showFavs
    },
    signOut() {
        this.$store.dispatch('signOut')
        .then(this.$router.push('/'))
    },
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

.active {
    color: blueviolet;
    opacity: .9;
}

li i {
    outline: none;
    margin: 30px auto;
    width: 50px;
    color: grey; 
    opacity: 0.5;
    vertical-align: middle;
}

li > span {
    text-transform: uppercase;
    transform:translateY(40px);
    position: absolute;
    color: #fff;
    font-weight: 600;
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