import type { Likes, Post, User, Community, Image } from "@prisma/client";

export interface IUser {
    id: string;
    name: string;
    email: string;
    username: string;
    image: string | null;
    bio?: string | null;
}

export interface IAuthor extends IUser {}

export interface IPost extends Post {
    community: ICommunityPost | null;
    author: IAuthor;
    children: IChildren[] | [];
    parent: Post | null;
    images: Image;
    likedByUser: boolean;
    likesCount: number;
    childrenCount: number;
}

export interface IChildren extends Post {
    author: IAuthor;
}

export interface ICommunityPost extends Community {
    creator: IAuthor | null;
}

export interface IReplies extends IPost {
    parent: IPost & {
        author: IAuthor;
        parent: IAuthor;
        children: IChildren[];
    };
}
