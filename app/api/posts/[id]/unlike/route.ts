import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const { id } = params;

        const post = await db.post.findUnique({
            where: {
                id,
            },
        });

        if (!post) {
            return new NextResponse("post.failed.not_found", { status: 404 });
        }

        const likesExists = await db.likes.findFirst({
            where: {
                postId: id,
                userId: session.user.id,
            },
        });

        if (!likesExists) {
            return new NextResponse("post.failed.unlike", {
                status: 400,
            });
        }

        await db.likes.delete({
            where: {
                postId_userId: {
                    postId: id,
                    userId: session.user.id,
                },
            },
        });

        const path = req.nextUrl.searchParams.get("path");
        if (path) {
            await revalidatePath(path);
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("Error in POST /api/posts/[id]/unlike: ", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
