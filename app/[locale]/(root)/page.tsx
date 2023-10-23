import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { IPost } from "@/types/db";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { linksConfig } from "@/config/site";
import { getTranslator } from "next-intl/server";
import MainFeed from "@/components/posts/feeds/main-feed";
import { ExtendedMetadata } from "@/types";

interface HomePageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.home");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function Home({ params }: HomePageProps) {
    const session = await getAuthSession();
    if (!session) redirect(linksConfig.signIn.href);

    const t = await getTranslator(params.locale, "root.posts");

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
            { deleted: false },
        ],
    };

    const posts = await db.post.findMany({
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

    return (
        <>
            {posts.length === 0 ? (
                <div className="text-muted-foreground mt-4 text-center leading-loose">
                    {t("empty")}
                </div>
            ) : (
                <div className="2xl:mx-4">
                    <MainFeed initialPosts={posts} />
                </div>
            )}
        </>
    );
}
