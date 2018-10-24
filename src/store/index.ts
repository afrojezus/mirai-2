// Redux store for the application.

import firebase from 'firebase';
import 'firebase/firestore';
import createHistory from 'history/createBrowserHistory';
import {
  firebaseReducer,
  getFirebase,
  reactReduxFirebase
} from 'react-redux-firebase';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { firestoreReducer, reduxFirestore } from 'redux-firestore';
import thunk from 'redux-thunk';
import { fireconfig } from '../api/firebase/config.json';
import Twist from '../api/twist';
import mirReducer from './anime';
import { MIR_TWIST_LOAD } from './mutation-types';

const firebaseConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  presence: 'presence', // where list of online users is stored in database
  sessions: 'sessions', // where list of user sessions is stored in database (presence must be enabled)
  enableLogging: true
};
const firestoreConfig = {};

firebase.initializeApp(fireconfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk.withExtraArgument(getFirebase),
  routerMiddleware(history)
];

if (process.env.NODE_ENV === 'development') {
  const { devToolsExtension } = window as any;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const rootReducer = combineReducers({
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  routing: routerReducer,
  mir: mirReducer
});

const createStoreWithFirebase: any = compose(
  reactReduxFirebase(firebase, firebaseConfig),
  reduxFirestore(firebase, firestoreConfig),
  applyMiddleware(...middleware),
  ...enhancers
)(createStore);

const store = createStoreWithFirebase(rootReducer, initialState);

const twistInit = (twist: Array<[]>) => ({
  type: MIR_TWIST_LOAD,
  twist
});

export const twistLoad = async () => {
  const state = store.getState();
  if (state.mir && state.mir.twist.length > 0) {
    return null;
  }
  Twist.load().then((twist: any) => store.dispatch(twistInit(twist)));

  return null;
};

twistLoad();

export default store;
