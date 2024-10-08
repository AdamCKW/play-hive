import { Suspense, lazy } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslator } from "next-intl/server";
import { linksConfig } from "@/config/site";
import { ExtendedMetadata } from "@/types";
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/posts/skeleton-card";
// import ProfileFeed from "@/components/posts/feeds/profile-feed";
const ProfileFeed = dynamic(
    () => import("@/components/posts/feeds/profile-feed"),
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

interface ProfilePageLayoutProps {
    params: { username: string; locale: string };
}

export async function generateMetadata({
    params: { locale, username },
}: ProfilePageLayoutProps) {
    const t = await getTranslator(locale, "metadata.profile");

    return {
        title: t("title", { user: username }),
        description: t("description", { user: username }),
    };
}

export default async function ProfilePage({ params }: ProfilePageLayoutProps) {
    const tProfile = await getTranslator(params.locale, "root.profile.page");
    const tPost = await getTranslator(params.locale, "root.posts");
    const session = await getAuthSession();

    const getUser = await db.user.findUnique({
        where: {
            username: params.username,
        },
    });

    if (!getUser) {
        notFound();
    }

    const posts = await db.post.findMany({
        where: {
            authorId: getUser.id,
            parent: null,
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
            parent: true,
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
                <button
                    className={
                        "border-primary h-10 w-full border-b py-2 text-center font-semibold"
                    }
                >
                    {tProfile("posts")}
                </button>
                <Link
                    href={`/${params.username}${
                        linksConfig.replies.disabled
                            ? "#"
                            : linksConfig.replies.href
                    }`}
                    className="text-muted-foreground hover:text-foreground hover:border-primary/50 h-10 w-full border-b py-2 text-center font-medium duration-200"
                >
                    {tProfile("replies")}
                </Link>
            </div>

            <div className="2xl:mx-4">
                <ProfileFeed initialPosts={posts} userId={getUser.id} />
            </div>
        </>
    );
}
