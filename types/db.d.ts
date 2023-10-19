import type { Likes, Post, User, Community, Image } from "@prisma/client";

export interface IUser extends Partial<User> {}

export interface IAuthor extends IUser {}

export interface IPost extends Post {
    community: ICommunity | null;
    author: IAuthor;
    children: IChildren[] | [];
    parent: IPost | Post | null;
    images: Image[];
    // likedByUser: boolean;
    // likesCount: number;
    // childrenCount: number;
    likes: Likes[];
    _count: {
        likes: number;
        children: number;
    };
}

export interface IChildren extends Post {
    author: IAuthor;
}

export interface ICommunity extends Community {
    creator?: IAuthor | null;
}

interface children {
    id: string;
    text: string;
    content: null | string;
    authorId: string;
    createdAt: Date;
    parentId: string;
    communityId: null | string;
    deleted: boolean;
    author: IAuthor;
    children: children[];
    parent: children;
    likes: Likes[]; // Define the type for likes
    images: Image[]; // Define the type for images
    _count: {
        likes: number;
        children: number;
    };
}

export interface IReplies extends Post {
    community: ICommunity | null;
    author: IAuthor;
    children: IChildren[] | [];
    parent: IPost | Post | null;
    images: Image[];
    likes: Likes[];
    _count: {
        likes: number;
        children: number;
    };
}
