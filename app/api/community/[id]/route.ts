import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { PostValidator } from "@/lib/validators/create-community-post";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();
        const url = new URL(req.url);
        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
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
                            id: params.id,
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
            return new NextResponse(error.message, { status: 422 });
        }

        console.log("ERROR in GET /api/community/[id]/route.ts:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        const body = await req.json();
        const { content } = PostValidator.parse(body);

        if (!session?.user) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const subscription = await db.subscription.findFirst({
            where: {
                userId: session.user.id,
                communityId: params.id,
            },
        });

        if (!subscription) {
            return new NextResponse("community.failed.not_subscribed", {
                status: 403,
            });
        }

        await db.post.create({
            data: {
                content: content,
                author: {
                    connect: {
                        id: session.user.id,
                    },
                },
                community: { connect: { id: params.id } },
            },
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        console.log("ERROR in POST /api/community/[id]/route.ts:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}

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
