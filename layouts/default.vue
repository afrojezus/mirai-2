<template>
  <div>
    <control-strip />
    <nuxt/>
  </div>
</template>

<script>
  import ControlStrip from '../components/ControlStrip';

  export default {
    data() {
      return {
        mobileMode: false,
      }
    },
    components: {
      ControlStrip,
    },
    watch: {

    },
    beforeMount () {

    },
  }
</script>

<style>
html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: #1C1F29;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  outline: none;
  transition: all 0.3s cubic-bezier(.07,.95,0,1);
}

h1, h2, h3, h4, h5, h6, p, span, strong, small, code {
  color: white;
}

.icon {
  width: 24px;
  height: 24px;
  margin: auto;
  fill: white;
}

button {
  background: transparent;
  border-radius: 0.25em;
  -webkit-appearance: none;

  border: solid 1pt rgba(255,255,255,.1);

  display: inline-flex;
}

  button:hover {
    border: solid 1pt rgba(255,255,255,.2);
    background: rgba(255,255,255,.1);
  }
</style>

