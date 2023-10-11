import { type Metadata } from "next";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useTranslations } from "next-intl";
import { getTranslator } from "next-intl/server";
import { ExtendedMetadata } from "@/types";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.forgot_password");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function ForgotPasswordPage() {
    const tPage = useTranslations("auth.forgot_password.page");

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
            </Card>
        </section>
    );
}
