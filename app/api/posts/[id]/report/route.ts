import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

        const reportsExists = await db.reports.findFirst({
            where: {
                postId: id,
                userId: session.user.id,
            },
        });

        if (reportsExists) {
            return new NextResponse("post.failed.reported", {
                status: 409,
            });
        }

        await db.reports.create({
            data: {
                post: {
                    connect: {
                        id,
                    },
                },
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("Error in POST /api/posts/[id]/report: ", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
