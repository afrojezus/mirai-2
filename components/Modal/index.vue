<template>
  <transition name="modal-fade">
    <div v-if="visible" class="dialog-wrapper" v-on:click="hide">
      <div class="dialog">
          <div class="dialog-window-bar">
            <h2>{{ header }}</h2>
            <button v-on:click="hide()" class="close" rel="closeBtn">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
              </svg>
            </button>
          </div>
          <div class="dialog-content scroll-container"><slot></slot></div>
      </div>
    </div>
  </transition>
</template>

<script src="./Modal.js"></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./Modal.css"></style>
