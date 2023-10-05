"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { Loader2 } from "lucide-react";

import { IPost } from "@/types/db";
import PostCard from "@/components/posts/post-card";
import { useInfinitePostQuery } from "@/hooks/use-infinite-post-query";

interface PostFeedProps {
    initialPosts: IPost[];
}

export default function IndexFeed({ initialPosts }: PostFeedProps) {
    const [noMore, setNoMore] = useState<boolean>(false);
    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const queryKey = ["posts"];

    const { data, fetchNextPage, isFetchingNextPage } = useInfinitePostQuery({
        queryKey,
        apiUrl: "/api/posts",
        initialData: {
            pages: [initialPosts],
            pageParams: [1],
        },
        setNoMore,
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage(); // Load more posts when the last post comes into view
        }
    }, [entry, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

    return (
        <>
            {posts.map((post, index) => {
                if (index === posts.length - 1) {
                    return (
                        <div key={post.id} ref={ref}>
                            <PostCard data={post} queryKey={queryKey} />
                        </div>
                    );
                } else {
                    return (
                        <div key={post.id}>
                            <PostCard data={post} queryKey={queryKey} />
                        </div>
                    );
                }
            })}

            <div className="flex w-full justify-center py-4">
                {!isFetchingNextPage && noMore && (
                    <div className="mt-4 text-center leading-loose text-neutral-600">
                        There are no more posts.
                    </div>
                )}

                {isFetchingNextPage && (
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                )}
            </div>
        </>
    );
}
