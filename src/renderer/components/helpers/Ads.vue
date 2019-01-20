<template>
  <div>
    <div class="ad-space" v-if="licenseInfo.policy === 'basic' && online === true" @click="openAd">
      <img :src="currentAd.img" alt="YOUR AD HERE">
    </div>
    <p class="ad-msg" v-if="licenseInfo.policy === 'basic' || licenseInfo.policy === null">
      Please
      <a linkTo="https://cadence-desktop/buy">Purchase a License</a> to remove ads and unlock new features
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currentAd", "online", "licenseInfo"])
  },
  methods: {
    openAd() {
      const { shell } = require("electron");
      shell.openExternal(this.currentAd.url);
    }
  }
};
</script>

<style scoped>

 .ad-msg {
   position: absolute;
   bottom: 8.6rem;
   left: 20rem;
    /* transform: translateX(-27px); */
    font-size: .95rem;
    
  }

  .ad-space {
    position: absolute;
    left: 19rem;
    bottom: 3rem;
    height: 90px;
    width: 728px;
    /* border: 1px solid gray; */
    background-color: white;
    margin: 0px auto;
    transform: translateX(-31px);
    cursor: pointer;
    
  }

</style>

