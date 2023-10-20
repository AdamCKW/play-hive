import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { linksConfig, siteConfig } from "@/config/site";
import { getAuthSession } from "@/lib/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { OAuthSignIn } from "@/components/auth/oauth-signin";
// import { UserLoginForm } from "@/components/auth/user-login-form";
import { Icons } from "@/components/icons";
import { getTranslator } from "next-intl/server";
import { cn } from "@/lib/utils";
import { ExtendedMetadata } from "@/types";
import dynamic from "next/dynamic";

const UserLoginForm = dynamic(
    () => import("@/components/auth/user-login-form"),
);

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.login");

    return {
        title: t("title"),
        description: t("description"),
    };
}

interface LoginPageProps {
    params: {
        locale: string;
    };
}

export default async function LoginPage({
    params: { locale },
}: LoginPageProps) {
    const session = await getAuthSession();

    if (session) {
        redirect("/");
    }
    
    const translate = await getTranslator(locale, "auth.login.page");

    return (
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
                    <UserLoginForm />
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
                            linksConfig.signUp.disabled
                                ? "#"
                                : linksConfig.signUp.href
                        }
                        className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
                    >
                        {translate("new_to", { siteName: siteConfig.name })}
                    </Link>

                    <Link
                        href={
                            linksConfig.forgotPassword.disabled
                                ? "#"
                                : linksConfig.forgotPassword.href
                        }
                        className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
                    >
                        {translate("forgot_password")}
                    </Link>
                </CardFooter>
            </Card>
        </section>
    );
}
