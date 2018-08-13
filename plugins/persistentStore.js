import Vue from 'vue';
import LocalForage from 'localforage';

const reduce = (state) => ({
  anime: {
    altTitle: state.anime.altTitle,
    autoTrack: state.anime.autoTrack,
    alwaysResume: state.anime.alwaysResume,
    trackingNotifications: state.anime.trackingNotifications,
    resumeNotifications: state.anime.resumeNotifications,
    library: state.anime.library,
  },
  user: {
    instance: state.user.instance,
    ban: state.user.ban,
  },
  videoPlayer: state.videoPlayer,
  notification: {
    browserNotifications: state.notification.browserNotifications,
  },
});

const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));

const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Vue.set(target, key, {});
        deepMerge(target[key], source[key]);
      } else {
        Vue.set(target, key, source[key]);
      }
    }
  }

  return deepMerge(target, ...sources);
}

export const RESTORE_MUTATION = (state, restoredState) => {
  deepMerge(state, restoredState);
  state.RESTORED = true;
}

export const RESTORED = false;

LocalForage.config({
  name: 'localforage',
  version: 1.0,
  storeName: 'animetwist_store',
});

export default () => {
  window.onNuxtReady((app) => {
    LocalForage.getItem('vuex').then((restoredState) => {
      app.$store.commit('RESTORE_MUTATION', restoredState);

      app.$store.subscribe((mutation) => {
        LocalForage.setItem('vuex', reduce(app.$store.state))
          .catch((err) => {
            throw err;
          });
      });
    })
      .catch((err) => {
        app.$store.commit('RESTORE_MUTATION', {});
      });
  });
}
