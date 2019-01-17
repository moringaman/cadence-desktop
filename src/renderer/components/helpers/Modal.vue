<template>
     <div class="modal" :class="{'is-active':showModal}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Please Confirm</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      Because favourites are often for use whilst you 
      are offline we advise you to download this library first
      so that it is accessible via your local cadence http server.

    </section>
    <footer class="modal-card-foot">
      <button class="button is-success">Continue</button>
      <button class="button">Cancel</button>
    </footer>
  </div>
</div>
</template>

<script>
export default {
    props: ['showModal'],
    data: function () {
        return {

        }
    },
    computed: {},
    methods:{},
    created(){}
}
</script>

<style scoped>

</style>


