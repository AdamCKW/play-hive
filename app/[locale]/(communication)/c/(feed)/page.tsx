import { RightBar } from "@/components/layout/right-bar";
import { SkeletonCard } from "@/components/posts/skeleton-card";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
// import MainCommunityFeed from "@/components/community/feeds/main-feed";
const MainCommunityFeed = dynamic(
    () => import("@/components/community/feeds/main-feed"),
    {
        ssr: false,
        loading: () => (
            <>
                {Array.from({ length: 10 }, (_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </>
        ),
    },
);

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.communities");

    return {
        title: t("title"),
        description: t("description"),
    };
}

interface CommunitiesPageProps {
    params: {
        locale: string;
    };
}

export default async function CommunitiesPage({
    params,
}: CommunitiesPageProps) {
    const session = await getAuthSession();
    const t = await getTranslator(
        params.locale,
        "communication.community.main_feed",
    );

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            community: true,
        },
    });

    const whereClause = {
        parent: null,
        deleted: false,
        AND: [
            {
                community: {
                    name: {
                        in: followedCommunities.map(
                            (sub) => sub.community.name,
                        ),
                    },
                },
            },
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
            images: true,
            parent: true,
            likes:
                session?.user.id == null
                    ? false
                    : { where: { userId: session.user.id } },
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

    return (
        <>
            {posts.length === 0 ? (
                <div className="text-muted-foreground mt-4 text-center leading-loose">
                    {t("empty")}
                </div>
            ) : (
                <div className="w-full 2xl:mx-4">
                    <MainCommunityFeed initialPosts={posts} />
                </div>
            )}
        </>
    );
}
