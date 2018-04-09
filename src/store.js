// TODO: Fix every single eslint-airbnb issue
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import {
  reactReduxFirebase,
  firebaseReducer,
  getFirebase
} from "react-redux-firebase";
import firebase from "firebase";
import mirReducer from "./modules";
import { MIR_TWIST_LOAD } from "./constants";
import { fireconfig } from "./utils/config.json";
import Twist from "./twist-api";

const rrfConfig = {
  userProfile: "users",
  profileParamsToPopulate: [
    { child: "role", root: "roles" } // populates user's role with matching role object from roles
  ],
  profileFactory: user => ({
    email: user.email || user.providerData[0].email,
    role: "Normal",
    providerData: user.providerData
  }),
  presence: "presence", // where list of online users is stored in database
  sessions: "sessions", // where list of user sessions is stored in database (presence must be enabled)
  enableLogging: false,
  fileMetadataFactory: uploadRes => {
    // upload response from Firebase's storage upload
    const { metadata: { downloadURLs } } = uploadRes;
    // default factory includes name, fullPath, downloadURL
    return downloadURLs[0];
  },
  resetBeforeLogin: false
};

firebase.initializeApp(fireconfig);

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk.withExtraArgument(getFirebase),
  routerMiddleware(history)
];

if (process.env.NODE_ENV === "development") {
  const { devToolsExtension } = window;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  routing: routerReducer,
  mir: mirReducer
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(...middleware),
  ...enhancers
)(createStore);

const store = createStoreWithFirebase(rootReducer, initialState);

const twistInit = twist => ({
  type: MIR_TWIST_LOAD,
  twist
});

export const twistLoad = async () => {
  const state = store.getState();
  if (state.mir && state.mir.twist) {
    return null;
  }
  Twist.load().then(twist => store.dispatch(twistInit(twist)));

  return null;
};

twistLoad();

export default store;
