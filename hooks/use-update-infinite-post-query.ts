import { useQueryClient } from "@tanstack/react-query";
import map from "lodash/map";
import { IPost, IReplies } from "@/types/db";

type oldQueryData = {
    pageParams: [number];
    pages: IPost[][] | IReplies[][];
};

export const updateInfiniteQueryLike = (
    queryClient: ReturnType<typeof useQueryClient>,
    queryKey: string[],
    postId: string,
    isLiking: boolean,
    countModifier: number,
) => {
    return queryClient.setQueryData(
        queryKey,
        (oldQueryData: oldQueryData | undefined) => {
            if (oldQueryData == null) return;

            const updatedPages = map(oldQueryData.pages, (page) => {
                return map(page, (post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likesCount: post._count.likes + countModifier,
                            likedByUser: isLiking,
                        };
                    }

                    if (post?.parent?.id === postId) {
                        return {
                            ...post,
                            parent: {
                                ...post.parent,
                                likesCount: post._count.likes + countModifier,
                                likedByUser: isLiking,
                            },
                        };
                    }

                    return post;
                });
            });

            return {
                ...oldQueryData,
                pages: updatedPages,
            };
        },
    );
};

export const updateInfiniteQueryReply = (
    queryClient: ReturnType<typeof useQueryClient>,
    queryKey: string[],
    postId: string,
) => {
    return queryClient.setQueryData(
        queryKey,
        (oldQueryData: oldQueryData | undefined) => {
            if (oldQueryData == null) return;

            const updatedPages = map(oldQueryData.pages, (page) => {
                const updatedPosts = map(page, (post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            childrenCount: post._count.children + 1,
                        };
                    }

                    if (post?.parent?.id === postId) {
                        return {
                            ...post,
                            parent: {
                                ...post.parent,
                                childrenCount: post._count.children + 1,
                            },
                        };
                    }
                    return post;
                });

                return updatedPosts;
            });

            return {
                ...oldQueryData,
                pages: updatedPages,
            };
        },
    );
};
