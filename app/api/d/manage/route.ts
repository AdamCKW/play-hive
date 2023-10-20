import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        if (session.user.role !== "ADMIN") {
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
        let where = {};

        if (sortString) {
            const [field, direction] = sortString.split(",");
            orderedBy = {
                [field]: direction,
            };
        }

        if (filterString) {
            const [field, value] = filterString.split(",");
            where = {
                [field]: {
                    contains: value,
                },
            };
        }

        const response = await db.user.findMany({
            where,
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
            },
            orderBy: orderedBy,
        });

        const totalUsers = await db.user.count();

        // Calculate total page count
        const pageCount = Math.ceil(totalUsers / parseInt(limit));

        const data = {
            row: response,
            pageCount,
        };

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }
        console.log("ERROR in GET /api/d/manage/route.ts:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getAuthSession();

        const headersInstance = headers();
        const authorization = headersInstance.get("authorization");

        const authorized = authorization === process.env.ADMIN_TOKEN;

        if (!session) {
            if (!authorized) {
                return new NextResponse("401.unauthorized", { status: 401 });
            }
        } else if (session.user.role !== "ADMIN") {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { id, action } = body;

        if (!id || !action) {
            return new NextResponse("404.not_found", { status: 404 });
        }

        let newRole: UserRole, message;

        switch (action) {
            case "promote_admin":
                newRole = "ADMIN";
                message = "Successfully Change Role To Admin";
                break;
            case "promote_moderator":
                newRole = "MODERATOR";
                message = "Successfully Change Role To Moderator";
                break;
            case "promote_user":
                newRole = "USER";
                message = "Successfully Change Role To User";
                break;
            case "ban_user":
                newRole = "BANNED";
                message = "Successfully Banned User";
                break;
            default:
                return new NextResponse("manage.failed.invalid_action", {
                    status: 400,
                });
        }

        const user = await db.user.update({
            where: { id },
            data: { role: newRole },
        });

        return new NextResponse(message, { status: 200 });
    } catch (error) {
        console.log("ERROR in PATCH /api/d/manage/route.ts:", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
