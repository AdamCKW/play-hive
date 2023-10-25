import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserAvatar } from "@/components/user-avatar";
import { notFound, redirect } from "next/navigation";
import { getTranslator } from "next-intl/server";
import { ExtendedMetadata } from "@/types";
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/posts/skeleton-card";
// import Parent from "@/components/posts/feeds/parent";
// import Main from "@/components/posts/feeds/main";
// import Children from "@/components/posts/feeds/children";
const Parent = dynamic(() => import("@/components/posts/feeds/parent"), {
    ssr: false,
    loading: () => <SkeletonCard />,
});
const Main = dynamic(() => import("@/components/posts/feeds/main"), {
    ssr: false,
    loading: () => <SkeletonCard main />,
});
const Children = dynamic(() => import("@/components/posts/feeds/children"), {
    ssr: false,
    loading: () => <SkeletonCard />,
});

interface PostPageProps {
    params: {
        id: string;
        locale: string;
    };
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.post");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { id, locale } = params;

    const session = await getAuthSession();

    const t = await getTranslator(locale, "root.posts");

    const post = await db.post.findUnique({
        where: {
            id,
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
            parent: {
                include: {
                    community: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
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
                    parent: {
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
    });

    if (!post) {
        notFound();
    }

    return (
        <>
            {post.parent && post.parent.parent ? (
                <Link href={"/p/" + post.parent.parentId}>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground flex pl-2"
                    >
                        <Icons.arrowUp className="mr-2 h-4 w-4" />
                        <UserAvatar
                            className="mr-2 h-4 w-4 overflow-hidden"
                            user={{
                                name: post.author.name!,
                                image: post.author.image!,
                            }}
                        />
                        {t("see_earlier_replies")}
                    </Button>
                </Link>
            ) : null}

            <div className="2xl:mx-4">
                {post.parent ? (
                    <Parent key={post.parent.id} initialPost={post.parent} />
                ) : null}

                <Main initialPost={post} />

                {post.children.length > 0 && (
                    <Children parentId={post.id} initialPosts={post.children} />
                )}
            </div>
        </>
    );
}
