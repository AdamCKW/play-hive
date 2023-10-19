import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const session = await getAuthSession();
        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        let followedCommunityList: string[] = [];

        if (session) {
            const followedCommunities = await db.subscription.findMany({
                where: {
                    userId: session.user.id,
                },
                include: {
                    community: true,
                },
            });

            if (followedCommunities) {
                followedCommunityList = followedCommunities.map(
                    (sub: any) => sub.community.name,
                );
            }
        }

        const { limit, page } = z
            .object({
                limit: z.string(),
                page: z.string(),
            })
            .parse({
                limit: url.searchParams.get("limit"),
                page: url.searchParams.get("page"),
            });

        let whereClause = {};

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc",
            },
            where: {
                parent: null,
                deleted: false,
                AND: [
                    {
                        community: {
                            name: {
                                in: followedCommunityList,
                            },
                        },
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
                            },
                        },
                    },
                },
                likes:
                    session?.user.id == null
                        ? false
                        : { where: { userId: session.user.id } },
                parent: true,
                _count: { select: { likes: true, children: true } },
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }
        console.log("ERROR in GET /api/community/route.ts:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, imageUrl } = CommunityValidator().parse(body);

        const communityExists = await db.community.findUnique({
            where: {
                name,
            },
        });

        if (communityExists) {
            return new NextResponse("community.failed.name_exist", {
                status: 409,
            });
        }

        // create community and associate it with the user
        const community = await db.community.create({
            data: {
                name,
                image: imageUrl,
                creatorId: session.user.id,
            },
        });

        // creator also has to be subscribed
        await db.subscription.create({
            data: {
                userId: session.user.id,
                communityId: community.id,
            },
        });

        const path = req.nextUrl.searchParams.get("path");
        if (path) {
            await revalidatePath(path);
        }

        return new NextResponse(community.name, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        console.log("ERROR in POST /api/community/route.ts:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
