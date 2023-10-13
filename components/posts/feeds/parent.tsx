"use client";

import { IPost } from "@/types/db";

// import PostCard from "@/components/posts/post-card";
import { usePostQuery } from "@/hooks/use-post-query";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/posts/skeleton-card";
import DeletedCard from "../deleted-card";

interface PostFeedProps {
    userId?: string;
    initialPost: IPost;
}

const PostCard = dynamic(() => import("@/components/posts/post-card"));

export default function Parent({ initialPost }: PostFeedProps) {
    const query = `/api/posts/${initialPost.id}`;
    const queryKey = ["post", initialPost.id];
    const { data, isLoading, isError } = usePostQuery({
        queryKey,
        query,
        initialData: initialPost,
    });

    const post = data ?? initialPost;

    if (isLoading) return <SkeletonCard />;

    if (post.deleted)
        return (
            <Suspense fallback={<SkeletonCard />}>
                <DeletedCard key={post.id} parent data={post} single />
            </Suspense>
        );

    return (
        <Suspense fallback={<SkeletonCard />}>
            <PostCard
                key={post.id}
                parent
                data={post}
                queryKey={queryKey}
                single
            />
        </Suspense>
    );
}
