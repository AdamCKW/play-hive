import { Suspense, lazy } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn, transformObject } from "@/lib/utils";
import { getTranslator } from "next-intl/server";
import { linksConfig } from "@/config/site";
import { PostLoading } from "@/components/posts/loading";
import { IReplies } from "@/types/db";
import { ExtendedMetadata } from "@/types";
// import { ProfileFeed } from "@/components/posts/feeds/profile-feed";

interface RepliesPageLayoutProps {
    params: { username: string; locale: string };
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.replies");

    return {
        title: t("title"),
        description: t("description"),
    };
}

const RepliesFeed = lazy(() => import("@/components/posts/feeds/replies-feed"));

export default async function RepliesPage({ params }: RepliesPageLayoutProps) {
    const tProfile = await getTranslator(params.locale, "root.profile.page");
    const tPost = await getTranslator(params.locale, "root.posts");
    const session = await getAuthSession();

    const getUser = await db.user.findUnique({
        where: {
            username: params.username,
        },
    });

    if (!getUser) return notFound();

    const replies = await db.post.findMany({
        where: {
            authorId: getUser?.id,
            NOT: {
                parent: null,
            },
            deleted: false,
        },
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
            parent: {
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
                    parent: {
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
                    likes:
                        session?.user.id == null
                            ? false
                            : { where: { userId: session.user.id } },
                    images: true,
                    _count: { select: { likes: true, children: true } },
                },
            },
            likes:
                session?.user.id == null
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

    const initialReplies: IReplies[] = replies.map(transformObject);

    return (
        <>
            <div className="mt-4 flex w-full">
                <Link
                    href={`/${params.username}`}
                    className="text-muted-foreground hover:text-foreground hover:border-primary/50 h-10 w-full border-b py-2 text-center font-medium duration-200"
                >
                    {tProfile("posts")}
                </Link>
                <button
                    className={
                        "border-primary h-10 w-full border-b py-2 text-center font-semibold"
                    }
                >
                    {tProfile("replies")}
                </button>
            </div>
            <Suspense fallback={<PostLoading />}>
                {replies.length === 0 ? (
                    <div className="text-muted-foreground mt-4 text-center leading-loose">
                        {tPost("empty_replies")}
                    </div>
                ) : (
                    <div className="2xl:mx-4">
                        <RepliesFeed
                            initialReplies={initialReplies}
                            userId={getUser.id}
                        />
                    </div>
                )}
            </Suspense>
        </>
    );
}
