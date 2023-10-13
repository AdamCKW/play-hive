import Link from "next/link";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { transformObject } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
// import Children from "@/components/post/feeds/comments";
// import Main from "@/components/posts/feeds/main";
// import Parent from "@/components/post/feeds/parent";
// import MainCard from "@/components/post/main-card";
// import PostCard from "@/components/post/post-card";
import { UserAvatar } from "@/components/user-avatar";
import { redirect } from "next/navigation";
import { getTranslator } from "next-intl/server";
import Parent from "@/components/posts/feeds/parent";
import Main from "@/components/posts/feeds/main";
import Children from "@/components/posts/feeds/children";

interface PostPageProps {
    params: {
        id: string;
        locale: string;
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { id, locale } = params;

    const session = await getAuthSession();

    const t = await getTranslator(locale, "root.posts");

    const data = await db.post.findUnique({
        where: {
            id,
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

    if (!data) {
        return (
            <div className="text-center text-neutral-600">Post not found.</div>
        );
    }

    const post = transformObject(data);

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

            <div className="mx-3 2xl:mx-4">
                {post.parent ? (
                    <Parent key={post.parent.id} initialPost={post.parent} />
                ) : null}

                <Main initialPost={post} />
                <Children parentId={post.id} initialPosts={post.children} />
            </div>
        </>
    );
}
