import Link from "next/link";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { getTranslator } from "next-intl/server";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import dynamic from "next/dynamic";
import JoinCommunityToggle from "@/components/community/join-community-toggle";
import CreatePostButton from "@/components/community/create-button";
import { SkeletonCard } from "@/components/posts/skeleton-card";
// import MainCommunityFeed from "@/components/community/feeds/community-feed";
const MainCommunityFeed = dynamic(
    () => import("@/components/community/feeds/community-feed"),
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
                where: {
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
                    images: true,
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

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
              where: {
                  community: {
                      name: params.name,
                  },
                  user: {
                      id: session.user.id,
                  },
              },
          });

    const isSubscribed = !!subscription;

    return (
        <>
            <div className="border-b pb-4">
                <div className="flex items-center space-x-4 px-4 sm:px-6">
                    <Avatar className="h-10 w-10 flex-none md:h-32 md:w-32">
                        {community.image ? (
                            <AvatarImage
                                src={community.image}
                                alt={`${community?.name}'s picture`}
                            />
                        ) : (
                            <AvatarFallback className="bg-indigo-500 text-xl font-medium text-white md:text-5xl">
                                {getInitials(community?.name!)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <h1 className="flex-1 truncate text-lg font-bold sm:text-2xl md:text-4xl">
                        c/{community.name}
                    </h1>
                    <div className="flex-1 lg:hidden">
                        <JoinCommunityToggle
                            isSubscribed={isSubscribed}
                            communityId={community.id}
                            communityName={community.name}
                        />
                    </div>
                </div>
                <div className="pt-4 lg:hidden">
                    <CreatePostButton />
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
