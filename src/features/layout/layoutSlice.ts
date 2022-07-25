import { Scheme } from "@material/material-color-utilities";
import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../common/utils/model";

interface Material3Scheme {
    light: Scheme;
    dark: Scheme;
}

interface LayoutState {
    colorScheme: PaletteMode | null;
    backgroundUserImage: string;
    user: User | null;
    material3Scheme: Material3Scheme | null;
}

// bunch of crap example data
const initialState: LayoutState = {
    colorScheme: null,
    backgroundUserImage: '',
    material3Scheme: null,
    user: {
        name: 'Mirai Dev',
        email: 'mirai.dev@thisemaildoesnotexist.com',
        avatar: 'https://bestprofilepictures.com/wp-content/uploads/2021/04/Anime-Girl-Profile-Picture.jpg',
        id: 0,
        favorites: [
            {
                id: 1000,
                title: 'Cory In The House',
                description: 'Cory is a very cool kid who lives in the white house',
                coverImage: 'https://resizing.flixster.com/SM_Y6uCQopZUKdYZlF0YEoHDPZw=/206x305/v2/https://flxt.tmsimg.com/assets/p186164_b_v7_aa.jpg',
                trailer: 'https://www.youtube.com/watch?v=aaxcziAOnTU',
                genre: ['Shonen'],
                episodes: [
                    {
                        id: 0,
                        anime: 1000,
                        name: 'Brand new start',
                        description: 'Cory moves into the white house or something',
                        episode: 1,
                        src: 'https://www.youtube.com/watch?v=Qa-7RSearp4'
                    }
                ]
            }
        ],
        watched: []
    }
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        changeBackgroundUserImage(state, newBackground) {
            state.backgroundUserImage = newBackground.payload;
            state.material3Scheme = null;
        },
        setNewMaterial3Scheme(state, newScheme) {
            state.material3Scheme = newScheme.payload;
        },
        setNewColorScheme(state, color) {
            state.colorScheme = color.payload;
        },
        changeProfilePicture(state, newPic) {
            if (state.user) {
                state.user.avatar = newPic.payload;
            }
        }
    }
});

export const { changeBackgroundUserImage, setNewMaterial3Scheme, setNewColorScheme, changeProfilePicture } = layoutSlice.actions;
export default layoutSlice.reducer;