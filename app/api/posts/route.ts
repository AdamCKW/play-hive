import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { transformObject } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const session = await getAuthSession();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            include: {
                following: true,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const followedUserIds: string[] = user.following.map((user) => user.id);

        const { limit, page } = z
            .object({
                limit: z.string(),
                page: z.string(),
            })
            .parse({
                limit: url.searchParams.get("limit"),
                page: url.searchParams.get("page"),
            });

        const response = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc",
                // likes: {
                //     _count: "desc",
                // },
            },
            where: {
                parent: null,
                AND: [
                    {
                        OR: [
                            {
                                author: {
                                    id: session.user.id,
                                },
                            },
                            {
                                author: {
                                    id: {
                                        in: followedUserIds,
                                    },
                                },
                            },
                        ],
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
                        bio: true,
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
                                bio: true,
                            },
                        },
                    },
                },
                likes:
                    session.user.id == null
                        ? false
                        : { where: { userId: session.user.id } },
                parent: true,
                images: true,
                _count: { select: { likes: true, children: true } },
            },
        });

        const posts = response.map(transformObject);

        return NextResponse.json(posts);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("Error in GET /api/posts", error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
