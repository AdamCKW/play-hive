import brevoTransport from "nodemailer-brevo-transport";
import nodemailer from "nodemailer";
import ResetPassword from "@/emails/reset";
import { db } from "@/lib/db";
import { generateRandomToken, getBaseUrl } from "@/lib/utils";
import { EmailValidation } from "@/lib/validators/reset-password";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const transporter = nodemailer.createTransport(
    new brevoTransport({
        apiKey: process.env.BREVO_API_KEY!,
    }),
);
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validate = EmailValidation();
        const { email } = validate.parse(body);

        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return new NextResponse("reset.failed.email_not_exist", {
                status: 404,
            });
        }

        const account = await db.account.findFirst({
            where: { userId: user.id },
        });

        if (account) {
            return new NextResponse("reset.failed.account_exist", {
                status: 400,
            });
        }

        // Expire in 1 hour
        const date = new Date();
        const expirationTimestamp = date.setHours(date.getHours() + 1);

        const resetToken = generateRandomToken();

        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                forgotPasswordToken: resetToken,
                forgotPasswordExpiry: new Date(expirationTimestamp),
            },
        });

        if (updatedUser) {
            const emailHtml = render(
                ResetPassword({
                    resetUrlLink: `${getBaseUrl()}/forgot-password/${resetToken}`,
                }),
            );

            const data = await transporter.sendMail({
                from: process.env.BREVO_EMAIL!,
                to: user.email!,
                subject: "Reset your password",
                html: emailHtml,
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("POST /api/auth/forgot-password/", error);

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
