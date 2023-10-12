import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { transformObject } from "@/lib/utils";
import { IPost } from "@/types/db";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import MainFeed from "@/components/posts/feeds/main-feed";
import { linksConfig } from "@/config/site";
import { getTranslator } from "next-intl/server";
import { Loader2 } from "lucide-react";

interface HomePageProps {
    params: {
        locale: string;
    };
}

export default async function Home({ params }: HomePageProps) {
    const session = await getAuthSession();
    const t = await getTranslator(params.locale, "root.posts");

    if (!session) redirect(linksConfig.signIn.href);
    const getUser = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            following: true,
        },
    });

    const followedUserIds = getUser?.following.map((follow) => follow.id);

    const whereClause = {
        parent: null,
        AND: [
            {
                OR: [
                    {
                        author: {
                            id: session.user.id,
                        },
                    },
                    {
                        author: {
                            id: {
                                in: followedUserIds,
                            },
                        },
                    },
                ],
            },
        ],
    };

    const data = await db.post.findMany({
        where: whereClause,
        include: {
            community: true,
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
                session.user.id == null
                    ? false
                    : { where: { userId: session.user.id } },
            images: true,
            _count: { select: { likes: true, children: true } },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    const posts: IPost[] = data.map(transformObject);

    return (
        <>
            <Suspense
                fallback={
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                }
            >
                {posts.length === 0 ? (
                    <div className="mt-4 text-center leading-loose text-neutral-600">
                        {t("empty")}
                    </div>
                ) : (
                    <div className="2xl:mx-4">
                        <MainFeed initialPosts={posts} />
                    </div>
                )}
            </Suspense>
        </>
    );
}
