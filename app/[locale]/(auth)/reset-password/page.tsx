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

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Enter your email to reset your password",
};

export default function ResetPasswordPage() {
    const tPage = useTranslations("auth.reset-password.page");

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
