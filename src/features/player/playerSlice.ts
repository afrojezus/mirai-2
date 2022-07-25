import { createSlice } from "@reduxjs/toolkit";
import { Anime } from "../../common/utils/model";

interface PlayerState {
    active: boolean;
    mini: boolean;
    fullscreen: boolean;
    anime: Anime | null;
}

const initialState: PlayerState = {
    active: false,
    fullscreen: false,
    mini: false,
    anime: null
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        showPlayer(state, action) {
            state.active = action.payload;
            if (!action.payload) {
                state.mini = initialState.mini;
                state.fullscreen = initialState.fullscreen;
                state.anime = initialState.anime;
            }
        },
        miniturizePlayer(state, action) {
            state.mini = action.payload;
        },
        loadAnime(state, action) {
            state.anime = action.payload;
        }
    }
});

export const { showPlayer, miniturizePlayer, loadAnime } = playerSlice.actions;
export default playerSlice.reducer;