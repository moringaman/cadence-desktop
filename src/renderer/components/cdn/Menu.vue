<template>
  <div>
    <div class="logo">
      <img src="../../assets/logo2.svg">Cadence
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
      <li class="nav-item" @click="signOut()">
        <i class="fa fa-sign-out fa-3x"></i>
        <span>LEAVE</span>
      </li>
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
    ...mapGetters(["showFavs", "showHistory", "showLocalStorage", "favs", "localCDNStorage", "lastSearchData"])
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
  padding: 30px 50px 10px;
  /* background-color: rgba(0,0,0, 0.2);*/
  background-color: rgba(255, 242, 0, 0.7);
  color: #fff;
  margin-left: -15px;
  margin-right: -25px;
  font-family: "Roboto Mono", monospace;
  font-size: 28px;
  margin-bottom: 50px;
  -webkit-app-region: drag;
}

.logo img {
  width: 50%;
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
  position:absolute;
  /* height: 20px; */
  min-width: 20px; 
  padding: 2px;
  border-radius: 4px;
  color: #fff;
  font-size: .8rem;
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
  margin: 30px auto;
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
</style>