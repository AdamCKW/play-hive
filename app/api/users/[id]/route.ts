import { getAuthSession } from "@/lib/auth";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { FullEditValidation } from "@/lib/validators/edit-profile";
import z from "zod";
import { decryptId } from "@/lib/utils";
import { User as UserData } from "@prisma/client";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        if (!session)
            return new NextResponse("401.unauthorized", { status: 401 });

        const { id } = params;
        const body = await req.json();
        const userId = decryptId(id);

        if (session.user.id !== userId)
            return new NextResponse("401.unauthorized", { status: 401 });

        const { username, name, email, bio, imageUrl, imageBanner, password } =
            FullEditValidation().parse(body);

        const user = await db.user.findUnique({
            where: { id: userId },
        });

        const getAccount = await db.account.findFirst({
            where: { userId },
        });

        if (!user) {
            return new NextResponse("404.user_not_found", { status: 404 });
        }

        const userData: {
            username?: string;
            name?: string;
            email?: string;
            bio?: string;
            image?: string;
            cover?: string;
            password?: string;
        } = {};

        if (username !== user.username) {
            const findExistingUsername = await db.user.findFirst({
                where: { username },
            });

            if (findExistingUsername) {
                return new NextResponse("settings.failed.username_exist", {
                    status: 400,
                });
            }

            userData.username = username;
        }
        if (name !== user.name) {
            userData.name = name;
        }
        if (!getAccount && email !== user.email) {
            userData.email = email;
        }
        if (bio !== user.bio) {
            userData.bio = bio;
        }
        if (imageUrl !== user.image) {
            userData.image = imageUrl;
        }
        if (imageBanner !== user.cover) {
            userData.cover = imageBanner;
        }
        if (!getAccount && password && password !== undefined) {
            const salt = await bcrypt.genSalt(11);
            const hashedPassword = await bcrypt.hash(password, salt);

            userData.password = hashedPassword;
        }

        await db.user.update({ where: { id: userId }, data: userData });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), {
                status: 422,
            });
        }

        console.log("ERROR in PATCH /api/users/[id]/:", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
