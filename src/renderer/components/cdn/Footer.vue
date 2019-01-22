<template>
  <div>
    <div v-if="loggedIn">
      <p>Local CDN server running on: http://localhost:9082, LAN address: http://{{ipAddress}}:9082</p>
    </div>
    <div class="network-status" :style="{backgroundColor: Label}">
      <span v-if="online" :class="{online: online}">ONLINE</span>
      <span v-if="!online" :class="{offline: !online}">OFFLINE</span>
      <div class="zigzag"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: function() {
    return {
      Label: ""
    };
  },
  computed: {
    ...mapGetters(["online", "ipAddress", "loggedIn"])
  },
  watch: {
    online(val) {
      if (val) {
        this.Label = "rgb(144, 238, 144)";
        console.log("netStat ", val);
        console.log(this.label);
        this.$store.dispatch("notificationCtrl", {
          msg:
            "You are back online, Yaaay!! You can search for & Download Libraries now",
          color: "success"
        });
      } else {
        this.Label = "gray";
        console.log("netStat ", val);
        this.$store.dispatch("notificationCtrl", {
          msg:
            "Oops looks like your network is down, Only your local CDN links will work",
          color: "danger"
        });
      }
    }
  }
};
</script>

<style  lang='scss' scoped>
body {
  /* overflow: hidden; */
}

div {
  height: 40px;
  width: 100vw;
  position: absolute;
  bottom: 0px;
  background-color: rgba(255, 242, 0, 0.7);
  margin: 0px;
  color: #fff;
  z-index: 98;
  border-bottom: -10px;
  padding: 10px;
  clear: both;
}

div p {
  color: blueviolet;
  line-height: 15px;
  font-size: 16px;
  margin: 3px -10px;
  /* float: left; */
  font-weight: 400;
  margin-left: -13rem;
}

span {
  z-index: 9000;
}

.network-status {
  display: grid;
  position: absolute;
  left: 4.5rem;
  background-color: rgb(144, 238, 144);
  width: 100px;
  height: 120%;
  margin: 0px 81%;
  bottom: 5px;
  padding: 8px 10px;
  grid-template-rows: 1fr;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  z-index: 8000;
}

.network-status > span {
  /* font-weight: bold; */
  grid-row: 1 / 1;
}

.online {
  color: blueviolet;
}

.offline {
  color: white;
  /* background-color: #333; */
}

$height: 12px;
$halfheight: ($height/2);
$thickness: 110%; // increase to make the line thicker
$offset: 4px;
$backgroundcolor: rgb(144, 238, 144);
$linecolor: blueviolet;

body {
  background: $backgroundcolor;
}

.zigzag {
  margin: -37% 0;
  width: 100%;
  background: $backgroundcolor;
  position: relative;
  height: $height;
  z-index: 8000;
  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
  }
  &:before {
    height: ($height - $offset);
    top: $thickness;
    background: linear-gradient(-135deg, $linecolor $halfheight, transparent 0)
        0 $halfheight,
      linear-gradient(135deg, $linecolor $halfheight, transparent 0) 0
        $halfheight;
    background-position: top left;
    background-repeat: repeat-x;
    background-size: $height $height;
  }
  &:after {
    height: $height;
    top: 100%;
    background: linear-gradient(
          -135deg,
          $backgroundcolor $halfheight,
          transparent 0
        )
        0 $halfheight,
      linear-gradient(135deg, $backgroundcolor $halfheight, transparent 0) 0
        $halfheight;
    background-position: top left;
    background-repeat: repeat-x;
    background-size: $height $height;
  }
}
</style>
