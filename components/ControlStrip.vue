<template>
  <div>
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
      <div class="user-menu" v-if="user">
      <button class="user-button" v-on:click="toggleMenu">
        <h1 class="user-name">{{user ? user.username : "Anonymous"}}</h1>
      <img alt="" src="" class="user-icon">
      </button>
        <nav v-if="showUserMenu" class="user-menu-content">

        </nav>
      </div>
      <button v-else class="anilist-login-button" v-on:click="getToken">
        Login with AniList
      </button>
    </header>
    <modal ref="tokenModal" header="AniList Login">
      <span>Enter your AniList token here</span>
      <form v-on:submit.prevent="useToken">
      <input :value="tempToken" v-on:change="handleTokenChange">
      </form>
    </modal>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import config from '@/api/anilist-api/config.json';
  import Modal from '@/components/Modal';

  export default {
    data() {
      return {
        activity: this.$route.name,
        isPlaying: false,
        currentPlay: null,
        showUserMenu: false,
        tempToken: ""
      }
    },
    methods: {
      ...mapActions([
        "anilistLogin",
      ]),
      toggleMenu () {
        this.showUserMenu = !this.showUserMenu;
      },
      getToken() {
        window.open(`https://anilist.co/api/v2/oauth/authorize?client_id=${config.clientID}&response_type=token`);
        this.$refs.tokenModal.show();
      },
      handleTokenChange(event) {
        this.tempToken = event.target.value;
      },
      useToken() {
        this.anilistLogin(this.tempToken);
        this.tempToken = "";
        this.$refs.tokenModal.hide();
      }
    },
    name: "control-strip",
    computed: {
      ...mapGetters([
        "user"
      ]),
    },
    components: {
      Modal
    }
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
  .anilist-login-button {
    -webkit-appearance: none;
    margin: auto;
    background: transparent;
    border: solid 1pt rgba(255,255,255,.1);
    border-radius: 0.25em;
    padding: 0.5em;
    display: inline-flex;
    color: white;
    font-weight: 500;
    font-size: 1em;
  }
  .anilist-login-button:hover {
    background: rgba(255,255,255,.1);
    border: solid 1pt rgba(255,255,255,.2);
  }
  .user-button {
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
  .user-menu-content {
    position: fixed;
    right: 0;
    top: 54px;
    min-height: 54px;
    box-shadow: 0 2px 32px rgba(0,0,0,.2);
    background: #1C1F29;
    z-index: 3000;
    width: 300px;
    animation: fade-in 0.3s ease;
  }

  @keyframes fade-in {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }
</style>
