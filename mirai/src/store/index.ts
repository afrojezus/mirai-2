import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {connectRouter, routerMiddleware} from 'connected-react-router';
import firebase, {User} from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import 'firebase/storage';

import {firestoreReducer, getFirestore, reduxFirestore} from "redux-firestore";


import config from '../firebase.json';
import createBrowserHistory from "history/createBrowserHistory";
import thunk from "redux-thunk";
import {firebaseReducer, getFirebase, reactReduxFirebase} from "react-redux-firebase";
import mirReducer from "./mirReducer";
import {MIR_TWIST_LOAD} from "./constants";
import Twist, {TwistFeed} from "../api/twist";

const rrfConfig = {
    userProfile: "users",
    useFirestoreForProfile: true,
    profileParamsToPopulate: [
        {child: "role", root: "roles"} // populates user's role with matching role object from roles
    ],
    resetBeforeLogin: false,
    presence: "presence",
    sessions: "sessions",
    enableLogging: true,
    profileFactory: (user: User) => ({
        email: user.email,
        role: "Standard",
        providerData: user.providerData
    }),
    fileMetadataFactory: (uploadRes: any) => { // This is an UploadTaskSnapshot, TS in CRA is spastic.
        // upload response from Firebase's storage upload
        const {metadata: {downloadURLs}} = uploadRes;
        // default factory includes name, fullPath, downloadURL
        return downloadURLs[0];
    },
};

firebase.initializeApp(config);

firebase.firestore();

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const middleware = [
    thunk.withExtraArgument(getFirebase),
    thunk.withExtraArgument(getFirestore),
    routerMiddleware(history)
];

// Trigger redux devtools
if (process.env.NODE_ENV === "development") {
    const {devToolsExtension} = (window as any);

    if (typeof devToolsExtension === "function") {
        enhancers.push(devToolsExtension());
    }
}

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    router: connectRouter(history),
    mir: mirReducer
});

const createStoreWithFirebase = compose<any>(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase),
    applyMiddleware(...middleware),
    ...enhancers,
)(createStore);

const store = createStoreWithFirebase(rootReducer, initialState);

const twistInit = (twist: any) => ({
    type: MIR_TWIST_LOAD,
    twist
});

export const twistLoad = async () => {
    const state = store.getState();
    if (state.mir && state.mir.twist) {
        return null;
    }
    new Twist().getAll().then((twist: TwistFeed | null) => store.dispatch(twistInit(twist)));

    return null;
};

twistLoad();

export default store;


