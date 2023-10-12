import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidation } from "@/lib/validators/create-post";
import { transformObject } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {
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

        let whereClause = {
            parent: null,
            deleted: false,
        };

        const response = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    likes: {
                        _count: "desc",
                    },
                },
            ],
            where: whereClause,
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
                    session?.user.id == null
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
        console.log("Error in GET /api/posts/discover: ", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
