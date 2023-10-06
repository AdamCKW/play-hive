import brevoTransport from "nodemailer-brevo-transport";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { RegisterValidation, RegisterRequest } from "@/lib/validators/sign-up";
import { generateRandomToken, getBaseUrl } from "@/lib/utils";
import VerifyEmail from "@/emails/verify";
import { render } from "@react-email/render";

export async function POST(req: NextRequest) {
    const transporter = nodemailer.createTransport(
        new brevoTransport({
            apiKey: process.env.BREVO_API_KEY!,
        }),
    );

    try {
        const body = await req.json();
        const validate = RegisterValidation();
        const { username, email, password } = validate.parse(body);

        const verificationToken = generateRandomToken();

        const dbUsername = await db.user.findUnique({
            where: {
                username,
            },
        });

        if (dbUsername) {
            return new NextResponse("failedRegister.usernameExist", {
                status: 409,
            });
        }

        const dbEmail = await db.user.findUnique({ where: { email } });
        if (dbEmail) {
            return new NextResponse("failedRegister.emailExist", {
                status: 409,
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await db.user.create({
            data: {
                name: username,
                username,
                email,
                password: hashedPassword,
                verificationToken,
            },
        });

        if (user) {
            const emailHtml = render(
                VerifyEmail({
                    verifyUrlLink: `${getBaseUrl}/verify/${verificationToken}`,
                }),
            );

            const data = await transporter.sendMail({
                from: process.env.BREVO_EMAIL!,
                to: user.email!,
                subject: "Welcome to PlayHive",
                html: emailHtml,
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        console.log("POST /api/auth/register/", error);

        return new NextResponse("subheading.500", { status: 500 });
    }
}
