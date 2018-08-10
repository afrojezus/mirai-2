<template>
  <section class="container">
    <div class="featured">

    </div>
    <div class="updates"></div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  }
}
</script>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
  display: flex;
}

  .featured {
    background: rgba(0,0,0,.1);
    padding: 1em;
    box-sizing: border-box;
    width: 100%;
    height: 400px;
  }
</style>

