import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
import { revalidatePath } from "next/cache";
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

        const { id: communityId } = CommunitySubscriptionValidator.parse(params);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                communityId,
                userId: session.user.id,
            },
        });

        if (subscriptionExists) {
            return new NextResponse("community.failed.subscribe", {
                status: 400,
            });
        }

        await db.subscription.create({
            data: {
                communityId,
                userId: session.user.id,
            },
        });

        const path = req.nextUrl.searchParams.get("path");
        if (path) {
            await revalidatePath(path);
        }

        return new NextResponse("success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }
        console.log("Error in POST /api/community/[id]/subscribe", error)
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
