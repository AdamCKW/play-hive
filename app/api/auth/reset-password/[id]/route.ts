import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NewPasswordValidation } from "@/lib/validators/reset-password";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export default async function PATCH(
    req: NextRequest,
    params: {
        id: string;
    },
) {
    try {
        const id = params.id;
        const body = await req.json();

        if (!id) {
            return new NextResponse("reset.params_empty", { status: 404 });
        }

        const split = id.split("_");

        const user = await db.user.findUnique({
            where: {
                id: split[0],
            },
        });

        if (!user) {
            return new NextResponse("reset.user_not_found", { status: 404 });
        }

        if (user.forgotPasswordToken !== split[1]) {
            return new NextResponse("reset.token_invalid", { status: 400 });
        }

        const validation = NewPasswordValidation();
        const { password } = validation.parse(body);

        const hasedPassword = await bcrypt.hash(password, 12);

        const updatedUser = await db.user.update({
            where: {
                id,
            },
            data: {
                password: hasedPassword,
            },
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("PATCH /api/auth/reset-password/[id]", error);

        return new NextResponse("subheading.500", { status: 500 });
    }
}
