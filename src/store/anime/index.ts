// Anime-related mutations.

import {
  MIR_PLAY_SHOW,
  MIR_SET_TITLE,
  MIR_TWIST_LOAD
} from '../mutation-types';

interface IAction {
  title: string;
  play: object;
  twist: Array<[]>;
  type: string;
}

const initialState = {
  mir: {
    title: '',
    play: null
  },
  twist: []
};

export default (state = initialState, action: IAction) => {
  switch (action.type) {
    case MIR_SET_TITLE:
      return {
        ...state,
        title: action.title
      };
    case MIR_TWIST_LOAD:
      return {
        ...state,
        twist: action.twist
      };
    case MIR_PLAY_SHOW:
      return {
        ...state,
        play: action.play
      };
    default:
      return state;
  }
};
