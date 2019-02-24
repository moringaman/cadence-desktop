<template>
  <div>
    <a href="https://cadence-desktop/buy" v-if="licenseInfo.policy === 'basic' && licenseTimeout < 7" class="account-status"> You're {{ 30 - licenseTimeout }} days into your 30 day free plan - Purchase Licence here for permanent access</a>
    <div class="btn-person" @click="showMenu">
      <i class="fa fa-user-circle fa-2x"></i>
	<div class="username">{{licenseInfo.username}}</div>	
    </div>

    <!-- <transition name="appear"> -->
    <div v-if="shoMenu" class="menu" @mouseleave="showMenu">
      <ul>
        <li @click="shoLicence=!shoLicence">Activate</li>
        <li>Change Username</li>
      </ul>
    </div>
    <div v-if="shoLicence" id="licence-input">
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="licenceCode"
          class="input is-medium"
          type="email"
          placeholder="Enter License Code"
        >
        <span class="icon is-left">
          <i class="fa fa-lock"></i>
        </span>
        <span class="icon is-right">
          <i class="fa fa-check"></i>
        </span>
      </div>
      <button @click="submitLicence" id="btn-licence" class="button is-primary is-medium">Submit</button>
      <button @click="shoLicence = false" id="btn-cancel" class="button is-medium">Cancel</button>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      shoMenu: false,
      shoLicence: false,
      licenceCode: ""
    };
  },
  computed: {
    ...mapGetters([
      'licenseInfo',
      'licenseTimeout'
    ])
  },
  watch: {},
  methods: {
    showMenu() {
      console.log("open menu");
      this.shoMenu = !this.shoMenu;
    },
    submitLicence() {
      console.log("submitLicence", this.licenceCode);
      this.shoLicence = false;
      // this.$store.dispatch("notificationCtrl", {
      //   msg: "Your Licence has been accepted full functionality enabled",
      //   color: "success"
      // });
      this.$store.dispatch('updateLicense', {licence: this.licenceCode})
    }
  },
  created() {
    this.$store.dispatch('accessRights', {check: "license"})
  }
};
</script>

<style scoped>
body {
font-size: 1rem;
}
.fa-user-circle {
  color: #ccc;
  /* font-size: 2rem; */
}

.fa-user-circle:hover {
  color: rgba(137, 43, 226, 0.555);
}

.menu {
  position: absolute;
  top: 3rem;
  left: 54rem;
  width: 180px;
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 2000;
  background-color: #fff;
  color: rgba(51, 51, 51, 0.664);
  overflow: hidden;
}
.menu > ul {
  list-style: none;
  text-align: left;
}

.menu > ul > li {
  display: block;
  padding: 5px;
  width: 150%;
  padding-left: 10px;
  transform: translateX(-10px);
  cursor: pointer;
}

.menu > ul > li:hover {
  background-color: rgba(204, 204, 204, 0.275);
  color: blueviolet;
}

.btn-person {
  cursor: pointer;
  z-index: 6000;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

input {
  width: 350px;
  grid-column: 1 /1;
}

#licence-input {
  z-index: 3000;
  background-color: #fff;
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  padding: 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  top: 5rem;
  left: 25rem;
  display: grid;
}

#btn-licence {
  grid-column: 2 /3;
  margin-left: 10px;
}

#btn-cancel {
  grid-column: 3 / 4;
  margin-left: 10px;
}

.account-status {
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  text-transform: uppercase;
  padding: 6px 12px 2px 12px;
  /* border: 1px solid red; */
  border-radius: 5px;
  display: inline;
  position: relative;
  top: 0rem;
 right: 2rem;
 font-size: 1rem;
}
.username {
font-size: 0.8rem;
top: 10px;
position: absolute;
right: 50px;
}
</style>


