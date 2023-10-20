import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { get, identity, map, pickBy } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        if (
            session.user.role !== "ADMIN" &&
            session.user.role !== "MODERATOR"
        ) {
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

        const sortString = url.searchParams.get("sort");
        const filterString = url.searchParams.get("filter");

        let orderedBy = {};

        if (sortString) {
            // Split the sort string using a comma as the delimiter
            const [field, direction] = sortString.split(",");

            if (field === "reports") {
                orderedBy = {
                    reports: {
                        _count: direction,
                    },
                };
            } else {
                orderedBy = {
                    [field]: direction,
                };
            }
        }

        let field, value;

        if (filterString) {
            // Split the filter string using a comma as the delimiter
            [field, value] = filterString.split(",");
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            where: {
                reports: {
                    some: { resolved: false },
                },
                author: {
                    username: {
                        contains: value,
                    },
                },
            },
            include: {
                _count: {
                    select: {
                        reports: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
            orderBy: orderedBy,
        });

        const numReports = await db.post.count({
            where: {
                reports: {
                    some: { resolved: false },
                },
            },
        });

        const reportsWithPostData = map(posts, (post) => {
            return pickBy(
                {
                    id: post.id,
                    name: get(post, "author.name"),
                    username: get(post, "author.username"),
                    reports: get(post, "_count.reports", 0), // Provide a default value (0) for reports if it's not present
                },
                identity,
            ); // Remove any properties with undefined values
        });

        const pageCount = Math.ceil(numReports / parseInt(limit));

        const data = {
            row: reportsWithPostData,
            pageCount,
        };

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("ERROR in GET /api/d/reports/route.ts:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        if (
            session.user.role !== "ADMIN" &&
            session.user.role !== "MODERATOR"
        ) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { id, action } = body;

        if (!id) {
            return new NextResponse("404.not_found", { status: 404 });
        }

        const post = await db.post.findUnique({
            where: {
                id: id,
            },
        });

        if (!post) {
            return new NextResponse("404.not_found", { status: 404 });
        }

        if (action === "delete") {
            await db.post.update({
                where: { id },
                data: {
                    text: "Deleted",
                    images: { set: [] },
                    content: { set: null },
                    deleted: true,
                },
            });
        }

        const updatedReports = await db.reports.updateMany({
            where: {
                postId: id,
            },
            data: {
                resolved: true,
            },
        });

        return new NextResponse("Reports Issue Resolved", { status: 200 });
    } catch (error) {
        console.log("ERROR in PATCH /api/d/reports/route.ts:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
