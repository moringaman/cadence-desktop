<template>
  <div>
    <li class="nav-item">
      <i :class="faIcon" class="fa" @click="clickEvent(eventName)"></i>
      <div class="counter" v-if="favs > 0">{{favs}}</div>
      <span>{{ itemName }}</span>
      <div id="pointer"></div>
    </li>
  </div>
</template>

<script>
export default {
  props: ["fa-icon", "item-name", "event-name", "active", "point", "favs"],
  data() {
    return {};
  },
  methods: {
    clickEvent: function(val) {
      console.log("hello ", val);
      this.$emit(val);
    }
  },
  created() {
    console.log("props: ", this.active);
  }
};
</script>

<style scoped >
li i {
  font-size: 1rem;
  outline: none;
  margin: 30px auto;
  width: 50px;
  color: grey;
  opacity: 0.5;
  vertical-align: middle;
  color: inherit;
}

li > span {
  text-transform: uppercase;
  transform: translateY(40px);
  position: absolute;
  color: #fff;
  font-weight: 600;
}

.fa {
  font-size: 2.4rem !important;
  text-align: center;
  vertical-align: top;
}

.counter {
  visibility: visible;
}

div.point #pointer {
  visibility: visible;
}
</style>


