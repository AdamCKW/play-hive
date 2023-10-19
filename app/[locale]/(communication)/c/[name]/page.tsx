import Link from "next/link";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";

import { IPost } from "@/types/db";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import MainCommunityFeed from "@/components/community/feeds/community-feed";

interface CommunityPageProps {
    params: {
        name: string;
        locale: string;
    };
}

interface DynamicMetadata {
    params: {
        locale: string;
        name: string;
    };
}

export async function generateMetadata({
    params: { locale, name },
}: DynamicMetadata) {
    const t = await getTranslator(locale, "metadata.community");

    return {
        title: t("title", { name }),
        description: t("description", { name }),
    };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const { name } = params;
    const session = await getAuthSession();
    const t = await getTranslator(
        params.locale,
        "communication.community.individual_feed",
    );

    const community = await db.community.findFirst({
        where: { name },
        include: {
            Post: {
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
                                },
                            },
                        },
                    },
                    parent: true,
                    likes:
                        session?.user.id == null
                            ? false
                            : { where: { userId: session.user.id } },
                    _count: { select: { likes: true, children: true } },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
            },
        },
    });

    if (!community) notFound();

    return (
        <>
            <div className="border-b pb-4">
                <div className="flex items-center space-x-4 ">
                    <Avatar className="h-32 w-32">
                        {community.image ? (
                            <AvatarImage
                                src={community.image}
                                alt={`${community?.name}'s picture`}
                            />
                        ) : (
                            <AvatarFallback className="bg-indigo-500 font-medium text-white">
                                {getInitials(community?.name!)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <h1 className="text-2xl font-bold md:text-4xl">
                        c/{community.name}
                    </h1>
                </div>
            </div>

            {community.Post.length === 0 ? (
                <div className="text-muted-foreground mt-4 text-center leading-loose">
                    {t("empty")}
                </div>
            ) : (
                <div className="2xl:mx-4">
                    <MainCommunityFeed
                        initialPosts={community.Post}
                        communityId={community.id}
                    />
                </div>
            )}
        </>
    );
}
