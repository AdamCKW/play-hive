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
            return new NextResponse("reset.emailNotExist", { status: 404 });
        }

        // Expire in 5 minutes
        const date = new Date();
        const expirationTimestamp = date.setMinutes(date.getMinutes() + 5);

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
                    resetUrlLink: `${getBaseUrl()}/reset-password/${resetToken}`,
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

        console.log("POST /api/auth/reset-password/", error);

        return new NextResponse("subheading.500", { status: 500 });
    }
}
