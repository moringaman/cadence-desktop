<template>
  <div>
    <div class="row">
      <admin-bar/>
    </div>
    <div class="row">
      <input
        v-if="online === true"
        type="text"
        class="input"
        v-model="search"
        placeholder="search for a CDN here and press ENTER"
        @keyup.enter="searchCDN"
      >
      <input
        v-if="online === false"
        type="text"
        class="input"
        v-model="search"
        placeholder="search is currently disabled: OFFLINE"
        @keyup.enter="searchCDN"
        disabled
      >
      <div class="btn-search" :class="{active: searchEnabled}" @click="searchCDN">
        SEARCH
        <i class="fa fa-search"></i>
      </div>
    </div>
  </div>
</template>

<script>
import AdminBar from "./AdminBar.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    AdminBar
  },
  data: function() {
    return {
      search: "",
      searchEnabled: false
    };
  },
  methods: {
    searchCDN() {
      if (this.searchEnabled) {
        this.$emit("searchCDN", this.search);
        this.search = "";
      } else {
        this.$store.commit("setNotification", {
          msg: "please enter a search term of over 3 letters",
          color: "warning"
        });
        setTimeout(() => {
          this.$store.commit("clearNotification");
        }, 4000);
      }
    }
  },
  watch: {
    search(val) {
      val.length > 2
        ? (this.searchEnabled = true)
        : (this.searchEnabled = false);
    }
  },
  computed: {
    ...mapGetters(["online"])
  }
};
</script>

<style scoped>
body {
  margin-bottom: 10px;
}

.input {
  margin: 40px 100px 50px -100px;
  width: 400px;
  padding: 20px;
  height: 40px;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  border-bottom: solid 2px blueviolet;
  font-family: "Roboto Mono", monospace;
  position: absolute;
  left: 50%;
  transform: translateX(-15%);
}

.btn-search {
  font-size: 1.2rem;
  position: relative;
  max-height: 40px;
  width: 120px;
  padding: 8px 10px 8px 5px;
  margin-left: 65%;
  margin-top: 17px;
  margin-bottom: 65px;
  background-color: blueviolet;
  color: white;
  opacity: 0.5;
  border-radius: 3px;
  transform: translateY(40px);
  cursor: pointer;
}

.active {
  opacity: 0.8;
}

div {
  font-family: "Roboto Mono", monospace;
  font-size: 18px;
}

i {
  font-size: 1.1rem;
  color: white;
  position: relative;
  margin-left: 10px;
  display: inline;
  /* margin-left: 450px;
    margin-top: 45px;
    top: 50; */
}
</style>