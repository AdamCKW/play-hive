"use client";

import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { IPost } from "@/types/db";

import { useInfinitePostQuery } from "@/hooks/use-infinite-post-query";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/posts/skeleton-card";

const PostCard = dynamic(() => import("@/components/posts/post-card"), {
    loading: () => <SkeletonCard />,
});
const DeletedCard = dynamic(() => import("@/components/posts/deleted-card"), {
    loading: () => <SkeletonCard />,
});

interface PostFeedProps {
    parentId: string;
    initialPosts: IPost[];
}

export default function Children({ parentId, initialPosts }: PostFeedProps) {
    const [noMore, setNoMore] = useState<boolean>(false);
    const t = useTranslations("root.posts");
    const lastPostRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const queryKey = ["comments", parentId];

    const { data, fetchNextPage, isFetchingNextPage } = useInfinitePostQuery({
        queryKey,
        apiUrl: `/api/posts/${parentId}/comments`,
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
                    if (post.deleted) {
                        return (
                            <div key={post.id} ref={ref}>
                                <DeletedCard data={post} />
                            </div>
                        );
                    } else
                        return (
                            <div key={post.id} ref={ref}>
                                <PostCard data={post} queryKey={queryKey} />
                            </div>
                        );
                } else {
                    if (post.deleted) {
                        return (
                            <div key={post.id}>
                                <DeletedCard data={post} />
                            </div>
                        );
                    }

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
                        {t("no_more_replies")}
                    </div>
                )}

                {isFetchingNextPage && (
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                )}
            </div>
        </>
    );
}
