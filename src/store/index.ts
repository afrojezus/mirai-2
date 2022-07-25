import { configureStore, Store } from "@reduxjs/toolkit";
import feedSlice from "../features/feed/feedSlice";
import layoutSlice from "../features/layout/layoutSlice";
import playerSlice from "../features/player/playerSlice";

export const store = configureStore({
    reducer: {
        layout: layoutSlice,
        player: playerSlice,
        feed: feedSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;