import localForage from 'localforage';
import * as types from '../mutation-types';

import ani from '@/api/anilist-api';

const mainState = {
  instance: null,
  animeList: [],
  mangaList: [],
  username: "John Doe",
  rank: 0
};

const actions = {
  anilistLogin({commit, state}, token) {
    return localForage.setItem("token", token)
      .then(() => {
        commit(types.USE_TOKEN, token);
        return ani.fetchUser(token)
          .then((user) => {
            console.log(user);
            commit(types.RECEIVE_USER, user);
            return user;
          });
      })
  },
};

const mainGetters = {
  user: state => state.instance,
  getAnimeList: state => state.animeList,
  getMangaList: state => state.animeList,
  getUsername: state => state.username,
  getUserRank: state => state.rank,
};

const mutations = {
  [types.USE_TOKEN](state, token) {
    state.instance = token;
  },
  [types.RECEIVE_USER](state, user) {
    state.username = user.username;
  },
};

export default {
  state: mainState,
  getters: mainGetters,
  actions,
  mutations,
  initialState: JSON.parse(JSON.stringify(mainState)),
}
