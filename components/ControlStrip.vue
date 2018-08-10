<template>
    <header>
      <button class="mirai-logo">Mirai</button>
      <div class="seperator"></div>
      <h1 class="activity">{{activity}}</h1>
      <div class="space"></div>
      <div class="seperator"></div>
      <button class="playing">
        <h1 class="playing-title">{{currentPlay ? currentPlay : "Player inactive"}}</h1>
      </button>
      <div class="seperator"></div>
      <button class="nav-button">Home</button>
      <button class="nav-button">Search</button>
      <button class="nav-button">Explore</button>
      <button class="nav-button">Privacy</button>
      <div class="seperator"></div>
      <button class="user">
        <h1 class="user-name">{{user ? user : "Anonymous"}}</h1>
      <img alt="" src="" class="user-icon">
      </button>
    </header>
</template>

<script>
  export default {
    data() {
      return {
        isUser: false,
        user: null,
        activity: this.$route.name,
        isPlaying: false,
        currentPlay: null
      }
    },
    name: "control-strip",
  }

</script>
<style scoped>
  header {
    width: 100%;
    display: flex;
    height: 54px;
    border-bottom: solid 1px rgba(255,255,255,.1);
    background: #1c1f29;
    position: fixed;
    top: 0;
    left: 0;
    padding-left: 1em;
    padding-right: 1em;
    box-sizing: border-box;
    z-index: 5000;
  }
  .space {
    flex: 1;
  }
  .seperator {
    margin: 1em;
    border-right: solid 1pt rgba(255,255,255,.1);
  }
  .mirai-logo {
    color: white;
    margin: auto;
    font-size: 1.75em;
    font-weight: 700;
    letter-spacing: -0.05em;
    border-radius: 1em;
    background: transparent;
    border: solid 1pt rgba(255,255,255,0);
  }
  .activity {
    color: white;
    margin: auto;
    font-size: 1.25em;
    font-weight: 500;
  }
  .user {
    -webkit-appearance: none;
    margin: auto;
    background: transparent;
    border: solid 1pt rgba(255,255,255,0);
    border-radius: 1em;
    display: inline-flex;
  }
  .user-name {
    color: white;
    margin: auto;
    font-size: 1.5em;
    font-weight: 500;
  }
  .user-icon {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,.5);
    margin-left: 1.5em;
  }
  .nav-button {
    -webkit-appearance: none;
    margin: auto;
    background: transparent;
    border: solid 1pt rgba(255,255,255,0);
    border-radius: 1em;
    display: inline-flex;
    color: white;
    font-size: 0.85em;
  }
  .playing {
    -webkit-appearance: none;
    margin: auto;
    background: transparent;
    border: solid 1pt rgba(255,255,255,0);
    border-radius: 1em;
    display: inline-flex;
  }
  .playing-title {
    margin: auto;
    color: white;
    font-size: 1.1em;
    font-weight: 500;
  }
</style>
