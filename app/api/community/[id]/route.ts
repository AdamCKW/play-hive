import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, imageUrl } = CommunityValidator().parse(body);

        const community = await db.community.findUnique({
            where: {
                id: params.id,
            },
            include: {
                creator: true,
            },
        });

        if (!community) {
            return new NextResponse("404.not_found", { status: 404 });
        }

        if (community.creator?.id !== session.user.id) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const updateData: {
            name?: string;
            image?: string;
        } = {};

        if (community.name !== name) {
            const existingCommunity = await db.community.findUnique({
                where: {
                    name,
                },
            });

            if (existingCommunity) {
                return new NextResponse("community.failed.name_exist", {
                    status: 409,
                });
            }

            updateData.name = name;
        }

        if (community.image !== imageUrl) {
            updateData.image = imageUrl;
        }

        await db.community.update({
            where: {
                id: community.id,
            },
            data: updateData,
        });

        return new NextResponse(community.name, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        console.log("ERROR in PATCH /api/community/[id]/route.ts:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
