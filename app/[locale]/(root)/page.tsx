import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { linksConfig } from "@/config/site";
import { getTranslator } from "next-intl/server";
// import MainFeed from "@/components/posts/feeds/main-feed";
import { ExtendedMetadata } from "@/types";
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/posts/skeleton-card";

const MainFeed = dynamic(() => import("@/components/posts/feeds/main-feed"), {
    ssr: false,
    loading: () => (
        <>
            {Array.from({ length: 10 }, (_, i) => (
                <SkeletonCard key={i} />
            ))}
        </>
    ),
});

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
    const t = await getTranslator(params.locale, "root.posts");
    const session = await getAuthSession();
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
            <div className="border-b pb-4">
                <div className="flex items-center space-x-4 px-6">
                    <h1 className="text-2xl font-bold">{t("heading")}</h1>
                </div>
            </div>
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
