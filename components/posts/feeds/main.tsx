"use client";

import { IPost } from "@/types/db";

import { usePostQuery } from "@/hooks/use-post-query";
import { SkeletonCard } from "../skeleton-card";
import dynamic from "next/dynamic";

const MainCard = dynamic(() => import("@/components/posts/main-card"), {
    loading: () => <SkeletonCard />,
});

const DeletedCard = dynamic(() => import("@/components/posts/deleted-card"), {
    loading: () => <SkeletonCard />,
});

interface PostFeedProps {
    initialPost: IPost;
}

export default function Main({ initialPost }: PostFeedProps) {
    const query = `/api/posts/${initialPost.id}`;

    const queryKey = ["post", initialPost.id];

    const { data, isLoading, isError } = usePostQuery({
        queryKey,
        query,
        initialData: initialPost,
    });

    const post = data ?? initialPost;

    if (isLoading) return <SkeletonCard />;

    if (post.deleted) return <DeletedCard key={post.id} data={post} noLink />;

    return <MainCard key={post.id} data={post} queryKey={queryKey} />;
}
