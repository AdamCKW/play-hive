import Link from "next/link";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { transformObject } from "@/lib/utils";
import { IPost } from "@/types/db";
import { getTranslator } from "next-intl/server";
import { Suspense, lazy } from "react";
import { PostLoading } from "@/components/loading";
// import DiscoverFeed from "@/components/posts/feeds/discover-feed";
// import ExploreFeed from "@/components/post/feeds/explore";

const DiscoverFeed = lazy(
    () => import("@/components/posts/feeds/discover-feed"),
);

interface DiscoverPageProps {
    params: {
        locale: string;
    };
}

export default async function DiscoverPage({
    params: { locale },
}: DiscoverPageProps) {
    const session = await getAuthSession();
    const t = await getTranslator(locale, "root.posts");

    const data = await db.post.findMany({
        where: { parent: null, deleted: false },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                    bio: true,
                },
            },
            children: {
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                            bio: true,
                        },
                    },
                },
            },
            parent: true,
            likes:
                session?.user.id == null
                    ? false
                    : { where: { userId: session.user.id } },
            images: true,
            _count: { select: { likes: true, children: true } },
        },
        orderBy: [
            {
                createdAt: "desc",
            },
            {
                likes: {
                    _count: "desc",
                },
            },
        ],
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    const posts: IPost[] = data.map(transformObject);

    return (
        <>
            <Suspense fallback={<PostLoading />}>
                {posts.length === 0 ? (
                    <div className="text-muted-foreground mt-4 text-center leading-loose">
                        {t("empty")}
                    </div>
                ) : (
                    <div className="2xl:mx-4">
                        <DiscoverFeed
                            userId={session?.user.id!}
                            initialPosts={posts}
                        />
                    </div>
                )}
            </Suspense>
        </>
    );
}
