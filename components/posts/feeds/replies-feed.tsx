"use client";

import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { Loader2 } from "lucide-react";

import { IPost, IReplies } from "@/types/db";
import { useInfinitePostQuery } from "@/hooks/use-infinite-post-query";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserAvatar } from "@/components/user-avatar";

import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/posts/skeleton-card";

const PostCard = dynamic(() => import("@/components/posts/post-card"), {
    loading: () => <SkeletonCard />,
});

const DeletedCard = dynamic(() => import("@/components/posts/deleted-card"), {
    loading: () => <SkeletonCard />,
});

interface RepliesFeedProps {
    userId: string;
    initialReplies: IReplies[];
}

export default function RepliesFeed({
    initialReplies,
    userId,
}: RepliesFeedProps) {
    const [noMore, setNoMore] = useState<boolean>(false);
    const t = useTranslations("root.posts");
    const lastPostRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const queryKey = ["replies", userId];

    const { data, fetchNextPage, isFetchingNextPage, isError } =
        useInfinitePostQuery({
            queryKey,
            apiUrl: `/api/users/${userId}/replies`,
            initialData: {
                pages: [initialReplies],
                pageParams: [1],
            },
            setNoMore,
        });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page) ?? initialReplies;

    return (
        <>
            {posts.map((post, index) => (
                <>
                    {post.parent && post.parent.parent ? (
                        <Link href={"/p/" + post.parent.parentId}>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-foreground/50 flex pl-2"
                            >
                                <Icons.arrowUp className="mr-2 h-4 w-4" />
                                <UserAvatar
                                    className="mr-2 h-4 w-4 overflow-hidden"
                                    user={{
                                        name: post.parent.parent.author.name,
                                        image: post.parent.parent.author.image,
                                    }}
                                />
                                {t("see_earlier")}
                            </Button>
                        </Link>
                    ) : null}

                    {post.parent ? (
                        post.parent.deleted ? (
                            <DeletedCard
                                key={post.parent.id}
                                parent
                                data={post.parent}
                            />
                        ) : (
                            <PostCard
                                key={post.parent.id}
                                parent
                                data={post.parent}
                                queryKey={queryKey}
                            />
                        )
                    ) : null}

                    {index === posts.length - 1 ? (
                        <div key={post.id} ref={ref}>
                            <PostCard data={post} queryKey={queryKey} />
                        </div>
                    ) : (
                        <div key={post.id}>
                            <PostCard data={post} queryKey={queryKey} />
                        </div>
                    )}
                </>
            ))}

            <div className="flex w-full justify-center py-4">
                {!isFetchingNextPage && noMore && (
                    <div className="text-muted-foreground mt-4 text-center leading-loose">
                        {t("no_more_replies")}
                    </div>
                )}

                {isFetchingNextPage && (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                )}
            </div>
        </>
    );
}
