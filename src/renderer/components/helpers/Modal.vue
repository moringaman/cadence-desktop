<template>
     <div class="modal" v-if="showModal" :class="{'is-active':showModal}"   transition="fade">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
      <slot name="title">
        Please Confirm
      </slot>
      </p>
      <button class="delete" aria-label="close"></button>
    </header>
    <div class="modal-card-body modal-content">
      <slot class="content">
        Please confirm this action
      </slot>
    </div>
    <footer class="modal-card-foot">
      <button class="button is-success" @click='confirm'>Continue</button>
      <button class="button"  @click="close">Cancel</button>
    </footer>
  </div>
</div>
</template>

<script>
export default {
    props: ['showModal'],
    data: function () {
        return {
         recipientAddress: '' 
        }
    },
    computed: {},
    methods:{
      close() {
        this.$store.dispatch('hideModal', 0)
        // this.$emit('cancel')
      },
      confirm() {
         this.$store.dispatch('confirmOperation', 1)
        // this.$emit('confirm')
      }
    },
    created(){}
}
</script>

<style scoped>
.modal-background{
  background-color: rgba(0,0,0,.5)
}

 .fade-enter-active, .fade-leave-active {
        transition: opacity .7s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>


