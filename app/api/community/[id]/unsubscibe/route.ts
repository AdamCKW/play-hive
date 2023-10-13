import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
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

        const { communityId } = CommunitySubscriptionValidator.parse(params);

        // check if user has already subscribed or not
        const subscriptionExists = await db.subscription.findFirst({
            where: {
                communityId,
                userId: session.user.id,
            },
        });

        if (!subscriptionExists) {
            return new NextResponse("community.failed.unsubscribe", {
                status: 400,
            });
        }

        await db.subscription.delete({
            where: {
                userId_communityId: {
                    communityId,
                    userId: session.user.id,
                },
            },
        });

        return new NextResponse(communityId);
    } catch (error) {
        error;
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }
        console.log("Error in POST /api/community/[id]/unsubscribe", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
