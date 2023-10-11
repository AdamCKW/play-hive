import { useQueryClient } from "@tanstack/react-query";

import { IPost } from "@/types/db";

export const updateQueryLike = (
    queryClient: ReturnType<typeof useQueryClient>,
    queryKey: string[],
    isLiking: boolean,
    countModifier: number,
) => {
    return queryClient.setQueryData(
        queryKey,
        (oldQueryData: IPost | undefined) => {
            if (oldQueryData == null) return;

            return {
                ...oldQueryData,
                likesCount: oldQueryData.likesCount + countModifier,
                likedByUser: isLiking,
            };
        },
    );
};

export const updateQueryReply = (
    queryClient: ReturnType<typeof useQueryClient>,
    queryKey: string[],
) => {
    return queryClient.setQueryData(
        queryKey,
        (oldQueryData: IPost | undefined) => {
            if (oldQueryData == null) return;

            return {
                ...oldQueryData,
                childrenCount: oldQueryData.childrenCount + 1,
            };
        },
    );
};
