import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
            select: { authorId: true },
        });

        if (!post) {
            return new NextResponse("post.failed.not_found", { status: 404 });
        }

        if (post.authorId !== session.user.id) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

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
