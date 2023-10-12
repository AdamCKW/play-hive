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
        const body = await req.json();
        const { id } = params;
        if (!id) {
            return new NextResponse("reset.failed.params_empty", {
                status: 404,
            });
        }

        const userId = params.id;

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return new NextResponse("reset.failed.user_not_found", {
                status: 404,
            });
        }

        const validation = NewPasswordValidation();
        const { password } = validation.parse(body);

        const hashedPassword = await bcrypt.hash(password, 12);

        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
                forgotPasswordToken: null,
                forgotPasswordExpiry: null,
            },
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("PATCH /api/auth/forgot-password/[id]", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
