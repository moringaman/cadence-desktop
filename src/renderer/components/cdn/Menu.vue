<template>
  <div>
    <div class="logo">
      <img id="cadence-logo" src="../../assets/logo2.svg">
       <i v-if="!licenseInfo.avatar" id="avatar" class="fa fa-user-circle fa-4x"></i>
       <div id="avatar-circle" v-if="licenseInfo.avatar">
       <img  class="avatar" :src="licenseInfo.avatar" alt="">
       </div>
       <div class="username">{{licenseInfo.username}}</div>	
    </div>
    <ul style="display: block">
      <app-menu-item
        fa-icon="fa fa-heart fa-3x"
        item-name="Favorites"
        event-name="showFavs"
        :favs="favs.length"
        @showFavs="showFav"
        :class="{active:showFavs, point:showFavs}"
      />
      <app-menu-item
        fa-icon="fa fa-download fa-3x"
        item-name="Downloads"
        event-name="clear"
        :favs="localCDNStorage.length"
        @clear="clearSearch"
        :class="{active:showLocalStorage, point:showLocalStorage}"
      />
      <app-menu-item
        fa-icon="fa fa-history fa-3x"
        item-name="History"
        event-name="history"
        :favs="lastSearchData.length"
        @history="shoHistory"
        :class="{active:showHistory, point: showHistory}"
      />
      <app-menu-item
        fa-icon="fa fa-thumbs-o-up fa-3x"
        item-name="popular"
        event-name="popular"
        :favs="0"
        @popular="popular"
      />
       <app-menu-item
        fa-icon="fa fa-sign-out fa-3x"
        item-name="signOut"
        event-name="signOut"
        :favs="0"
        @signOut="signOut"
      />
      <!-- <li class="nav-item" @click="signOut()">
        <i class="fa fa-sign-out fa-3x"></i>
        <span>LEAVE</span>
      </li> -->
      <!-- <li><router-link :to="cdnNotes">cnd notes</router-link></li> -->
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import menuItem from "./MenuItem.vue";

export default {
  components: { appMenuItem: menuItem },
  data() {
    return {
      //    showFavs: false
      cdnNotes: "cdn-detail"
    };
  },
  computed: {
    ...mapGetters([
      "showFavs",
      "showHistory",
      "showLocalStorage",
      "favs",
      "localCDNStorage",
      "lastSearchData",
      "licenseInfo"
    ])
  },
  methods: {
    ...mapActions(["clearSearchData", "signOut"]),

    clearSearch() {
      this.$store.commit("toggleShowHistory", false);
      this.$store.commit("showFavs", false);
      this.$store.commit("clearSearchData");
      this.$store.commit("toggleShowLocalStorage", true);
    },
    shoHistory() {
      this.$store.commit("clearSearchData");
      this.$store.commit("toggleShowHistory", true);
      this.$store.commit("showFavs", false);
      this.$store.commit("toggleShowLocalStorage", false);
    },
    popular() {
      console.log("clicked popular item");
    },
    showFav() {
      this.$store.commit("clearSearchData");
      this.$store.commit("showFavs", true);
      this.$store.commit("toggleShowLocalStorage", false);
      this.$store.commit("toggleShowHistory", false);
      //  this.showFavs = this.$store.getters.showFavs
    },
    signOut() {
      this.$store.dispatch("signOut").then(this.$router.push("/"));
    }
  }
};
</script>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

.logo {
  padding: 5px 20px 5px;
  /* background-color: rgba(0,0,0, 0.2);*/
  background-color: rgba(255, 242, 0, 0.7);
  color: blueviolet;
  margin-left: -30px;
  margin-right: -25px;
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  /* font-weight: 600; */
  margin-bottom: 10px;
  -webkit-app-region: drag;
}

.username {
  font-size: 0.7rem;
  margin: 1.0rem auto .4rem 1rem;
  padding: 0.5rem;
  color: #fff;
  font-weight: 600;
  background-color:rgb(137, 43, 226);
  display: inline-block;
}

.logo #cadence-logo {
  position: absolute;
  width: 1.5rem;
  left: 0.5rem;
  margin-right: 3.5rem;
  transform: translateY(5px);
}

.active {
  color: blueviolet;
  opacity: 0.9;
}

#pointer {
  position: relative;
  height: 20px;
  width: 20px;
  background-color: #fff;
  /* border: 1px solid blueviolet; */
  right: -35px;
  z-index: -1;
  transform: rotate(45deg);
  visibility: hidden;
  /* border-radius: 5px; */
}

li.point > #pointer {
  visibility: visible;
}

li > .counter {
  position: absolute;
  /* height: 20px; */
  min-width: 20px;
  padding: 2px;
  border-radius: 4px;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.1rem;
  background-color: blueviolet;
  font-weight: 600;
  z-index: 3000;
  left: 6.5rem;
  transform: translateY(-1rem);
  /* right: 1.6rem;
  top: -1rem; */
  clear: both;
}

li i {
  outline: none;
  margin: 20px auto;
  width: 50px;
  color: grey;
  opacity: 0.5;
  vertical-align: middle;
  transform: translateX(1rem);
}

li > span {
  text-transform: uppercase;
  transform: translate(1rem 40px);
  position: absolute;
  color: #fff;
  /* font-weight: 600; */
}

li i:hover {
  color: blueviolet;
}

.fa {
  /* font-size: 2.2rem; */
  text-align: center;
  vertical-align: top;
}

#avatar {
  margin-top: 1rem;
  color: white;
  font-size: 4em !important;
  margin-left: 1rem;
}

#avatar-circle {
  width: 75px;
  height: 75px;
  background-color: transparent;
  /* border: 2px solid #fff; */
  border-radius: 50%;
  margin: auto auto;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.avatar {
  margin: auto auto;
  position: absolute;
  width: 90px;
   /* transform: translateY(-5px); */
  left: 2.8rem;
  top: 1.4rem;
}
</style>