import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import { RESTORE_MUTATION, RESTORED } from '@/plugins/persistentStore'

import user from './modules/user';
import anime from './modules/anime';
import videoPlayer from './modules/video-player';
import notification from './modules/notification';

const NODE_ENV = process.env.NODE_ENV;
const live = NODE_ENV === 'test' || NODE_ENV === 'production';
const debug = NODE_ENV === 'test' || NODE_ENV === 'development';
const testing = NODE_ENV === 'testing';

let plugins = [];

if (debug && process.browser) {
  plugins = [createLogger()];
} else if (testing) {
  plugins = [];
} else {
  plugins = [];
}

const createStore = () => {
  return new Vuex.Store({
    modules: {
      user,
      anime,
      videoPlayer,
      notification,
    },
    mutations: { RESTORE_MUTATION },
    state: { RESTORED },
    strict: !testing && !live,
    plugins,
  });
};

export default createStore;
