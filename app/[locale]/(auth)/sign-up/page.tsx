import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { linksConfig, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { OAuthSignIn } from "@/components/auth/oauth-signin";
import { UserRegisterForm } from "@/components/auth/user-register-form";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";
import { link } from "fs";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.register");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function RegisterPage({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const session = await getAuthSession();

    if (session) {
        redirect("/");
    }
    const translate = await getTranslator(locale, "auth.register.page");

    return (
        <>
            <section className="container grid max-w-lg items-center gap-8 pb-8 pt-6 md:py-8">
                <Card className="md:border-none md:shadow-none">
                    <CardHeader className="space-y-1 text-center">
                        <Icons.command className="mx-auto h-6 w-6" />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {translate("heading")}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {translate("subheading")}
                        </p>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <UserRegisterForm />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">
                                    {translate("continue_with")}
                                </span>
                            </div>
                        </div>
                        <OAuthSignIn />
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                            href={
                                linksConfig.signIn.disabled
                                    ? "#"
                                    : linksConfig.signIn.href
                            }
                            className="text-muted-foreground hover:text-primary group text-sm"
                        >
                            {translate("already_have")}{" "}
                            <span className="text-primary underline-offset-4 group-hover:underline">
                                {translate("sign_in")}
                            </span>
                        </Link>

                        <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
                            {translate("agreeing")}{" "}
                            <Link
                                href={
                                    linksConfig.terms.disabled
                                        ? "#"
                                        : linksConfig.terms.href
                                }
                                className="hover:text-primary underline underline-offset-4"
                            >
                                {translate("terms")}{" "}
                            </Link>
                            {translate("and")}{" "}
                            <Link
                                href={
                                    linksConfig.privacy.disabled
                                        ? "#"
                                        : linksConfig.privacy.href
                                }
                                className="hover:text-primary underline underline-offset-4"
                            >
                                {translate("privacy")}
                            </Link>
                            .
                        </p>
                    </CardFooter>
                </Card>
            </section>
        </>
    );
}
