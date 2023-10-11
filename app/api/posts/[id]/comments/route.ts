import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidation } from "@/lib/validators/create-post";
import { cleanUp } from "@/lib/utils";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const body = await req.json();
        const postId = params.id;

        const { content, files } = PostValidation().parse(body);
        // const { files } = body;

        const parentPost = await db.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!parentPost)
            return new NextResponse("post.failed.not_found", { status: 404 });

        const createdComments = await db.post.create({
            data: {
                text: cleanUp(content),
                author: {
                    connect: {
                        id: session.user.id,
                    },
                },
                parent: {
                    connect: {
                        id: postId,
                    },
                },
            },
        });

        if (files && createdComments) {
            const imageRecords = await Promise.all(
                files.map(async (url: string) => {
                    const createdImage = await db.images.create({
                        data: {
                            url,
                            post: {
                                connect: {
                                    id: createdComments.id,
                                },
                            },
                        },
                    });

                    return createdImage.id; // Return the ID of the created image
                }),
            );

            const updatePost = await db.post.update({
                where: {
                    id: createdComments.id,
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
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("POST /api/posts/[id]/comments/:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
