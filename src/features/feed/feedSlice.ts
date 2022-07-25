import { createSlice } from "@reduxjs/toolkit";
import { Feed, FeedType } from "../../common/utils/model";

interface FeedState {
    posts: Feed[];
}

const initialState: FeedState = {
    posts: [
        {
            id: 0,
            date: Date.now(),
            author: {
                name: 'Mirai Dev',
                email: 'mirai.dev@thisemaildoesnotexist.com',
                avatar: 'https://bestprofilepictures.com/wp-content/uploads/2021/04/Anime-Girl-Profile-Picture.jpg',
                id: 0,
                favorites: [],
                watched: []
            },
            content: "I really love watching Cory In The House, it's so cool.",
            images: [
                'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
                'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                'https://images.unsplash.com/photo-1522770179533-24471fcdba45'
            ],
            type: FeedType.POST
        },
        {
            id: 1,
            date: Date.now(),
            author: {
                name: 'Mirai Dev',
                email: 'mirai.dev@thisemaildoesnotexist.com',
                avatar: 'https://bestprofilepictures.com/wp-content/uploads/2021/04/Anime-Girl-Profile-Picture.jpg',
                id: 0,
                favorites: [],
                watched: []
            },
            content: "Bored atm....",
            images: [],
            type: FeedType.POST
        },
        {
            id: 2,
            date: Date.now(),
            author: {
                name: 'Robot',
                email: 'NONE',
                avatar: '',
                id: 1,
                favorites: [],
                watched: []
            },
            content: "Post 3",
            images: [],
            type: FeedType.POST
        },
        {
            id: 3,
            date: Date.now(),
            author: {
                name: 'Robot',
                email: 'NONE',
                avatar: '',
                id: 1,
                favorites: [],
                watched: []
            },
            content: "Post 4",
            images: [],
            type: FeedType.ACTIVITY
        },
        {
            id: 4,
            date: Date.now(),
            author: {
                name: 'Robot',
                email: 'NONE',
                avatar: '',
                id: 1,
                favorites: [],
                watched: []
            },
            content: "Post 5",
            images: [],
            type: FeedType.ACTIVITY
        },
        {
            id: 5,
            date: Date.now(),
            author: {
                name: 'Robot',
                email: 'NONE',
                avatar: '',
                id: 1,
                favorites: [],
                watched: []
            },
            content: "Post 6",
            images: [],
            type: FeedType.ACTIVITY
        },
        {
            id: 6,
            date: Date.now(),
            author: {
                name: 'Robot',
                email: 'NONE',
                avatar: '',
                id: 1,
                favorites: [],
                watched: []
            },
            content: "Post 7",
            images: [],
            type: FeedType.ACTIVITY
        },
        {
            id: 7,
            date: Date.now(),
            author: {
                name: 'Mirai Dev',
                email: 'mirai.dev@thisemaildoesnotexist.com',
                avatar: 'https://bestprofilepictures.com/wp-content/uploads/2021/04/Anime-Girl-Profile-Picture.jpg',
                id: 0,
                favorites: [],
                watched: []
            },
            content: "Watched Cory In The House",
            images: [],
            type: FeedType.ACTIVITY
        },
    ]
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {

    }
});

export const { } = feedSlice.reducer;
export default feedSlice.reducer;