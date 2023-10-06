import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { RegisterValidation, RegisterRequest } from "@/lib/validators/sign-up";
import { generateRandomToken, getBaseUrl } from "@/lib/utils";
import VerifyEmail from "@/emails/verify";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
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
            return NextResponse.json(
                {
                    error: "Username already exist. Please use a different username.",
                },
                { status: 409 },
            );
        }

        const dbEmail = await db.user.findUnique({ where: { email } });
        if (dbEmail) {
            return NextResponse.json(
                {
                    error: "Email already in use. Please use a different email address.",
                },
                { status: 409 },
            );
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
            const data = await resend.emails.send({
                // from: "onboarding@resend.dev",
                // to: "adamkwchong@gmail.com",
                // subject: "Hello World",
                // html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
                from: process.env.RESEND_EMAIL!,
                to: user.email!,
                subject: "Welcome to PlayHive",
                react: VerifyEmail({
                    verifyUrlLink: `${getBaseUrl}/verify/${verificationToken}`,
                }),
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
