import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NewPasswordValidation } from "@/lib/validators/reset-password";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        const body = await req.json();

        if (!id) {
            return new NextResponse("reset.params_empty", { status: 404 });
        }

        const split = id.split("_");
        const userId = split[0];
        const token = split[1];

        const user = await db.user.findUnique({
            where: {
                id: userId,
                forgotPasswordToken: token,
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
                id: userId,
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
