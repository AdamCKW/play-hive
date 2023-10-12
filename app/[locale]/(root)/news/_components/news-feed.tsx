"use client";

import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import NewsCard from "./news-card";
import { notFound } from "next/navigation";

interface NewsFeedProps {
    initialData: any[];
}

export default function NewsFeed({ initialData }: NewsFeedProps) {
    const [noMore, setNoMore] = useState<boolean>(false);
    const lastPostRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ["news"],
        async ({ pageParam = 1 }) => {
            const query = `api/gamespot?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;

            const { data } = await axios.get(query);

            return data;
        },

        {
            getNextPageParam: (_, pages) => {
                return pages.length + 1;
            },
            initialData: { pages: [initialData], pageParams: [1] },
        },
    );

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    const news = data?.pages.flatMap((page) => page) ?? initialData;

    if (!news) return notFound();

    return (
        <>
            {news.map((post, index) => {
                if (index === news.length - 1) {
                    return (
                        <div key={post.id} ref={ref}>
                            <NewsCard data={post} />
                        </div>
                    );
                } else {
                    return <NewsCard key={post.id} data={post} />;
                }
            })}
            <div className="flex w-full justify-center py-4">
                {!isFetchingNextPage && noMore && (
                    <div className="mt-4 text-center leading-loose text-neutral-600">
                        There are no more news.
                    </div>
                )}

                {isFetchingNextPage && (
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                )}
            </div>
        </>
    );
}
