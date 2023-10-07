import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { transformObject } from "@/lib/utils";
import { IPost } from "@/types/db";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import MainFeed from "@/components/posts/feeds/main-feed";

export default async function Home() {
    const session = await getAuthSession();

    if (!session) redirect("/sign-up");

    // console.log(session);
    // const getUser = await db.user.findUnique({
    //     where: { id: session.user.id },
    //     include: {
    //         following: true,
    //     },
    // });

    // const followedUserIds = getUser?.following.map((follow) => follow.id);

    // const whereClause = {
    //     parent: null,
    //     AND: [
    //         {
    //             OR: [
    //                 {
    //                     author: {
    //                         id: session.user.id,
    //                     },
    //                 },
    //                 {
    //                     author: {
    //                         id: {
    //                             in: followedUserIds,
    //                         },
    //                     },
    //                 },
    //             ],
    //         },
    //     ],
    // };

    // const data = await db.post.findMany({
    //     where: whereClause,
    //     include: {
    //         community: true,
    //         author: {
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 username: true,
    //                 image: true,
    //             },
    //         },
    //         children: {
    //             include: {
    //                 author: {
    //                     select: {
    //                         id: true,
    //                         name: true,
    //                         username: true,
    //                         image: true,
    //                     },
    //                 },
    //             },
    //         },
    //         parent: true,
    //         likes:
    //             session.user.id == null
    //                 ? false
    //                 : { where: { userId: session.user.id } },
    //         images: true,
    //         _count: { select: { likes: true, children: true } },
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    //     take: INFINITE_SCROLL_PAGINATION_RESULTS,
    // });

    // const posts: IPost[] = data.map(transformObject);

    return (
        <>
            <h1 className="text-9xl">Main Page</h1>
        </>
    );
}
