"use client";

import { IPost } from "@/types/db";
import { usePostQuery } from "@/hooks/use-post-query";
import DeletedCard from "@/components/posts/deleted-card";
import PostCard from "@/components/posts/post-card";

interface PostFeedProps {
    userId?: string;
    initialPost: IPost;
}

export default function Parent({ initialPost }: PostFeedProps) {
    const query = `/api/posts/${initialPost.id}`;
    const queryKey = ["post", initialPost.id];
    const { data, isLoading, isError } = usePostQuery({
        queryKey,
        query,
        initialData: initialPost,
    });

    const post = data ?? initialPost;

    if (post.deleted)
        return <DeletedCard key={post.id} parent data={post} single />;

    return (
        <PostCard key={post.id} parent data={post} queryKey={queryKey} single />
    );
}
