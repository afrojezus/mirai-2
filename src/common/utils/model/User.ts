import { Anime } from "./Anime";

export interface User {
    name: string;
    email: string;
    avatar: string;
    id: number;
    favorites: Anime[];
    watched: Anime[];
}