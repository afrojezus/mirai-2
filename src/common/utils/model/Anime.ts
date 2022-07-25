export interface Anime {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    trailer: string;
    genre: string[];
    episodes: Episode[];
}

export interface Episode {
    id: number;
    anime: number;
    name: string;
    description: string;
    episode: number;
    src: string;
}