import { type Metadata } from "next";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useTranslations } from "next-intl";
import { getTranslator, redirect } from "next-intl/server";
import { ExtendedMetadata } from "@/types";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getAuthSession } from "@/lib/auth";
import { linksConfig } from "@/config/site";
import Link from "next/link";

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.forgot_password");

    return {
        title: t("title"),
        description: t("description"),
    };
}

interface ForgotPasswordPageProps {
    params: {
        locale: string;
    };
}

export default async function ForgotPasswordPage({
    params,
}: ForgotPasswordPageProps) {
    const session = await getAuthSession();

    if (session) {
        redirect("/");
    }

    const tPage = await getTranslator(
        params.locale,
        "auth.forgot_password.page",
    );

    return (
        <section className="container grid max-w-lg items-center gap-8 pb-8 pt-6 md:py-8">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">{tPage("title")}</CardTitle>
                    <CardDescription>{tPage("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                        href={
                            linksConfig.signIn.disabled
                                ? "#"
                                : linksConfig.signIn.href
                        }
                        className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
                    >
                        {tPage("made_a_mistake")}
                    </Link>
                </CardFooter>
            </Card>
        </section>
    );
}
