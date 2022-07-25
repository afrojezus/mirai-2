import { User } from "./User";

export enum FeedType {
    POST,
    ACTIVITY
}

export interface Feed {
    id: number;
    author: User;
    content: string;
    images: string[];
    date: number;
    type: FeedType;
};