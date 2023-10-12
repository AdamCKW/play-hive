import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cleanUp, transformObject } from "@/lib/utils";
import { PostValidation } from "@/lib/validators/create-post";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const session = await getAuthSession();
        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            include: {
                following: true,
            },
        });

        if (!user) {
            return new NextResponse("404.user_not_found", { status: 404 });
        }

        const followedUserIds: string[] = user.following.map((user) => user.id);

        const { limit, page } = z
            .object({
                limit: z.string(),
                page: z.string(),
            })
            .parse({
                limit: url.searchParams.get("limit"),
                page: url.searchParams.get("page"),
            });

        const response = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc",
            },
            where: {
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
                ],
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
                                bio: true,
                            },
                        },
                    },
                },
                likes:
                    session.user.id == null
                        ? false
                        : { where: { userId: session.user.id } },
                parent: true,
                images: true,
                _count: { select: { likes: true, children: true } },
            },
        });

        const posts = response.map(transformObject);

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("Error in GET /api/posts:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();

        if (!session?.user)
            return new NextResponse("401.unauthorized", { status: 401 });

        const body = await req.json();

        const { content, files } = PostValidation().parse(body);

        const createdPost = await db.post.create({
            data: {
                text: cleanUp(content),
                author: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });

        if (files && createdPost) {
            const imageRecords = await Promise.all(
                files.map(async (url: string) => {
                    const createdImage = await db.images.create({
                        data: {
                            url,
                            post: {
                                connect: {
                                    id: createdPost.id,
                                },
                            },
                        },
                    });

                    return createdImage.id; // return the id of the created image
                }),
            );

            const updatePost = await db.post.update({
                where: {
                    id: createdPost.id,
                },
                data: {
                    images: {
                        connect: imageRecords.map((record) => ({
                            id: record,
                        })),
                    },
                },
            });
        }

        return new NextResponse("Success", { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("ERROR in POST /api/posts:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
