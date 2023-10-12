import { getAuthSession } from "@/lib/auth";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { FullEditValidation } from "@/lib/validators/edit-profile";
import z from "zod";
import { decryptId } from "@/lib/utils";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();

        if (!session)
            return new NextResponse("401.unauthorized", { status: 401 });

        const { id } = params;

        const userId = decryptId(id);
        const body = await req.json();

        if (session.user.id !== id)
            return new NextResponse("401.unauthorized", { status: 401 });

        const { username, name, email, bio, imageUrl, imageBanner, password } =
            FullEditValidation().parse(body);

        const getUser = await db.user.findUnique({
            where: { id: userId },
        });

        if (!getUser)
            return new NextResponse("404.user_not_found", { status: 404 });

        const getAccount = await db.account.findFirst({
            where: { userId },
        });

        const findExistingUsername = await db.user.findFirst({
            where: { username },
        });

        if (findExistingUsername)
            return new NextResponse("settings.failed.username_exist", {
                status: 400,
            });

        if (getAccount) {
            await db.user.update({
                where: { id: userId },
                data: {
                    username,
                    name,
                    bio,
                    image: imageUrl,
                    cover: imageBanner,
                },
            });
        } else {
            if (!password && password !== undefined) {
                console.log(password);
                const salt = await bcrypt.genSalt(11);
                const hashedPassword = await bcrypt.hash(password, salt);

                await db.user.update({
                    where: { id: userId },
                    data: {
                        username,
                        name,
                        bio,
                        email,
                        image: imageUrl,
                        cover: imageBanner,
                        password: hashedPassword,
                    },
                });
            } else {
                await db.user.update({
                    where: { id: userId },
                    data: {
                        username,
                        name,
                        bio,
                        email,
                        image: imageUrl,
                        cover: imageBanner,
                    },
                });
            }
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), {
                status: 422,
            });
        }

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
