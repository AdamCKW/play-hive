import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { db } from "./db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "Username or Email",
                    type: "text",
                    placeholder: "test@test.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "test@test.com",
                },
            },
            async authorize(credentials, req) {
                if (
                    !credentials ||
                    !credentials.username ||
                    !credentials.password
                )
                    throw new Error("Credentials is empty");

                const dbUser = await db.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.username },
                            { username: credentials.username },
                        ],
                    },
                });

                if (!dbUser || !dbUser?.password)
                    throw new Error(
                        "Invalid username or password. Please try again.",
                    );

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    dbUser.password!,
                );

                if (!isPasswordValid)
                    throw new Error(
                        "Invalid username or password. Please try again.",
                    );

                return dbUser;
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.username = token.username;
                session.user.role = token.role;
            }

            return session;
        },

        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (!dbUser) {
                token.id = user!.id;
                return token;
            }

            if (!dbUser.username) {
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        username: nanoid(10),
                    },
                });
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
                role: dbUser.role,
            };
        },
        redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
