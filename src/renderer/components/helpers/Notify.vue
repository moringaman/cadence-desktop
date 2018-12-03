<template>
    <transition name="pop">
        <div v-if="notification !== ' '" class="notify">
          {{notification}}
          <div class="icon-circle">
            <i class="fa fa-info fa-2x icon-circle__icon"></i>
          </div>
          </div>
      </transition>
</template>

<script>
export default {
    props: ['notification']
}
</script>

<style>

.notify {
  position: absolute;
  bottom: 70px;
  right: 10px;
  min-height: 80px;
  width: 500px;
  max-width: 500px;
  color: #fff;
  font-weight: bold;
  font-size: 1em;
  background-color: blueviolet;
  border: 1px solid lightgray;
  text-align: left;
  border-radius: 10px;
  padding: 10px 10px 10px 50px;
  z-index: 300;
  word-wrap:normal;
  opacity: .7;
  /* overflow: hidden; */
}

.notify > .icon-circle {
  width: 50px;
  height: 50px;
  background-color: white;
  color: blueviolet;
  padding: 2px;
  border: 3px solid blueviolet;
  border-radius: 50%;
  position: absolute;
  z-index: 301;
  top: 10px;
  transform: translate(-50px, -30px);
}

.notify > .icon-circle > .icon-circle__icon {
    margin-top: 3px;
}



.pop-enter-active, .pop-leave-active {
  transition: all .7s ease-out /*cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transform: translateY(300px); */
}

.pop-enter, .pop-leave-to {
   /* transform: translateY(300px); */
   opacity: 0;
   transform: translateY(250px)
}


</style>

