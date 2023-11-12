"use client";

import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { Loader2 } from "lucide-react";
import { IPost } from "@/types/db";
import { useInfinitePostQuery } from "@/hooks/use-infinite-post-query";
import { useTranslations } from "next-intl";
import PostCard from "@/components/posts/post-card";

interface ProfileFeedProps {
    userId: string;
    initialPosts: IPost[];
}

export default function ProfileFeed({
    initialPosts,
    userId,
}: ProfileFeedProps) {
    const [noMore, setNoMore] = useState<boolean>(false);
    const t = useTranslations("root.posts");
    const lastPostRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const queryKey = ["profile", userId];

    const { data, fetchNextPage, isFetchingNextPage, isError } =
        useInfinitePostQuery({
            queryKey,
            apiUrl: `/api/users/${userId}/posts`,
            initialData: {
                pages: [initialPosts],
                pageParams: [1],
            },
            setNoMore,
        });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
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

            {posts.length === 0 ? (
                <div className="text-muted-foreground mt-4 text-center leading-loose">
                    {t("empty")}
                </div>
            ) : (
                <div className="flex w-full justify-center py-4">
                    {!isFetchingNextPage && noMore && (
                        <div className="text-muted-foreground mt-4 text-center leading-loose">
                            {t("no_more")}
                        </div>
                    )}

                    {isFetchingNextPage && (
                        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    )}
                </div>
            )}
        </>
    );
}
