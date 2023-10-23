"use client";

import { IPost } from "@/types/db";

import { usePostQuery } from "@/hooks/use-post-query";
import DeletedCard from "@/components/posts/deleted-card";
import MainCard from "@/components/posts/main-card";

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

    if (post.deleted) return <DeletedCard key={post.id} data={post} noLink />;

    return <MainCard key={post.id} data={post} queryKey={queryKey} />;
}
