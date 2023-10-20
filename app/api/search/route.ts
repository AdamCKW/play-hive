import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.nextUrl);
        const q = url.searchParams.get("q");

        if (!q) return new NextResponse("Invalid query", { status: 400 });

        const userResponse = await db.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: q,
                        },
                    },
                    {
                        username: {
                            contains: q,
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            },
            take: 10,
        });

        const communityResponse = await db.community.findMany({
            where: {
                name: {
                    contains: q,
                },
            },
            take: 10,
        });

        const response = {
            users: userResponse,
            communities: communityResponse,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log("ERROR in GET /api/search/route.ts:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
