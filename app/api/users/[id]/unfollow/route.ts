import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FollowValidation } from "@/lib/validators/follow";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id: followingId } = FollowValidation.parse(params);
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const currentUser = await db.user.findUnique({
            where: {
                id: session?.user?.id,
            },
        });

        const followUserExist = await db.user.findUnique({
            where: {
                id: followingId,
            },
            include: {
                followedBy: true,
            },
        });

        if (!currentUser || !followUserExist) {
            return new NextResponse("404.user_not_found", { status: 404 });
        }

        const isFollowing = followUserExist.followedBy.some(
            (follow) => follow.id === currentUser.id,
        );

        if (!isFollowing) {
            return new NextResponse("following.failed.not_followed", {
                status: 400,
            });
        }

        const response = await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                following: {
                    disconnect: {
                        id: followingId,
                    },
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
            return new NextResponse(JSON.stringify(error.issues), {
                status: 422,
            });
        }
        console.log("ERROR in /api/users/[id]/unfollow/:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
