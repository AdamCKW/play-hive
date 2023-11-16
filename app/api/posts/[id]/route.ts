import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }
        const { id } = params;

        const posts = await db.post.findUnique({
            where: { id },
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

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("Error in GET /api/posts/[id]: ", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();
        const { id } = params;

        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        if (!id) {
            return new NextResponse("post.failed.missing_id", { status: 400 });
        }

        const post = await db.post.findUnique({
            where: { id },
            select: { authorId: true, images: true },
        });

        if (!post) {
            return new NextResponse("post.failed.not_found", { status: 404 });
        }

        if (post.authorId !== session.user.id) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        // await db.post.update({
        //     where: { id },
        //     data: {
        //         text: "deleted",
        //         images: { set: [] },
        //         content: { set: null },
        //         deleted: true,
        //     },
        // });

        await db.images.deleteMany({
            where: {
                id: {
                    in: post.images.map((image) => image.id),
                },
            },
        });

        await db.post.update({
            where: { id },
            data: {
                text: "deleted",
                images: { set: [] },
                content: { set: null },
                deleted: true,
            },
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("Error in DELETE /api/posts/[id]: ", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
