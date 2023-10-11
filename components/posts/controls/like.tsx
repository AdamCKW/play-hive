"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

import { toast } from "@/hooks/use-toast";
import { updateQueryLike } from "@/hooks/use-update-post-query";
import { updateInfiniteQueryLike } from "@/hooks/use-update-infinite-post-query";
import { useTranslations } from "next-intl";

interface LikeProps {
    postId: string;
    likedByUser: boolean;
    single?: boolean;
    queryKey?: string[];
}

export default function Like({
    postId,
    likedByUser,
    single,
    queryKey,
}: LikeProps) {
    const [liked, setLiked] = useState<boolean>(likedByUser);
    const [isLiking, setIsLiking] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const tToast = useTranslations("toast");
    const tLike = useTranslations("root.posts.card.like");

    const { mutate: like, isLoading } = useMutation({
        mutationFn: async (likePost: boolean) => {
            const { data } = await axios.post(
                `/api/posts/${postId}/${likePost ? "like" : "unlike"}`,
            );
            return data as string;
        },
        onMutate: async () => {
            const countModifier = isLiking ? 1 : -1;

            if (queryKey === undefined) return;

            await queryClient.cancelQueries(queryKey);
            const oldData = await queryClient.getQueryData(queryKey);

            if (single)
                updateQueryLike(queryClient, queryKey, isLiking, countModifier);
            else
                updateInfiniteQueryLike(
                    queryClient,
                    queryKey,
                    postId,
                    isLiking,
                    countModifier,
                );

            return { oldData };
        },
        onError: (err, _likePost, context) => {
            const oldData = context?.oldData;

            if (oldData && queryKey) {
                queryClient.setQueryData(queryKey, oldData);
            }

            if (err instanceof AxiosError) {
                return toast({
                    title: tToast("500.heading"),
                    description: tToast(err.response?.data),
                    variant: "destructive",
                });
            }

            return toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive",
            });
        },
        onSettled: () => {
            if (!queryKey) return;
            queryClient.invalidateQueries(queryKey);
        },
    });

    const handleLike = () => {
        setIsLiking((prev) => !prev);
        like(!liked);
        setLiked((prev) => !prev);
    };

    return (
        <button
            disabled={isLoading}
            className={`group duration-200 ${
                liked && "text-red-600"
            } rounded-full hover:text-destructive focus-visible:text-red-500 hover:dark:text-red-500`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
            }}
        >
            <span className="flex h-7 w-7 items-center justify-center rounded-full outline-red-400 group-hover:bg-red-600/5 dark:group-hover:bg-red-300/20">
                <Heart
                    fill={liked ? "#dc2626" : "transparent"}
                    className="h-5 w-5"
                />
                <span className="sr-only">
                    {liked ? tLike("like") : tLike("unlike")}
                </span>
            </span>
        </button>
    );
}
