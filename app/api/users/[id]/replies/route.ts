import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;
        const url = new URL(req.url);
        const session = await getAuthSession();
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

        const replies = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            where: {
                authorId: id,
                NOT: {
                    parent: null,
                },
                deleted: false,
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
                parent: {
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
                        parent: {
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
                        images: true,
                        likes:
                            session.user.id == null
                                ? false
                                : { where: { userId: session.user.id } },
                        _count: { select: { likes: true, children: true } },
                    },
                },
                images: true,
                likes:
                    session.user.id == null
                        ? false
                        : { where: { userId: session.user.id } },
                _count: { select: { likes: true, children: true } },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(replies, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("ERROR in GET /api/users/[id]/replies: ", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
