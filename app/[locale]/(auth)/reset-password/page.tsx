import { type Metadata } from "next";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { useTranslations } from "next-intl";
import { getTranslator } from "next-intl/server";

// export const metadata: Metadata = {
//     title: "Forgot Password",
//     description: "Enter your email to reset your password",
// };

type ExtendMetadata = Metadata & { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: ExtendMetadata) {
    const t = await getTranslator(locale, "metadata.reset-password");

    return {
        title: t("title"),
        description: t("description"),
        icons: [{ rel: "icon", url: "images/logo.png" }],
    };
}

export default function ResetPasswordPage() {
    const tPage = useTranslations("auth.reset.page");

    return (
        <section className="container grid max-w-lg items-center gap-8 pb-8 pt-6 md:py-8">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">{tPage("title")}</CardTitle>
                    <CardDescription>{tPage("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </section>
    );
}
