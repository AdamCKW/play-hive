import Link from "next/link";
import { notFound } from "next/navigation";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { getTranslator } from "next-intl/server";
import { ExtendedMetadata } from "@/types";
import RepliesFeed from "@/components/posts/feeds/replies-feed";

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
                },
            },
            parent: {
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

            {replies.length === 0 ? (
                <div className="text-muted-foreground mt-4 text-center leading-loose">
                    {tPost("empty_replies")}
                </div>
            ) : (
                <div className="2xl:mx-4">
                    <RepliesFeed initialReplies={replies} userId={getUser.id} />
                </div>
            )}
        </>
    );
}
