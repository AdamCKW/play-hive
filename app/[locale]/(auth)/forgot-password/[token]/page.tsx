import { NewPasswordForm } from "@/components/auth/new-password-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/db";

import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

interface ChangeNewPasswordPageProps {
    params: {
        locale: string;
        token: string;
    };
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.new_password");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function ChangeNewPassword({
    params: { locale, token },
}: ChangeNewPasswordPageProps) {
    if (!token) notFound();

    const tPage = await getTranslator(locale, "auth.new_password.page");

    const user = await db.user.findFirst({
        where: {
            forgotPasswordToken: token,
        },
        select: {
            id: true,
            username: true,
            forgotPasswordToken: true,
            forgotPasswordExpiry: true,
        },
    });

    if (!user) {
        notFound();
    }

    const currentDatetime = new Date();

    if (user.forgotPasswordExpiry! < currentDatetime) {
        notFound();
    }

    return (
        <section className="container grid max-w-lg items-center gap-8 pb-8 pt-6 md:py-8">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">{tPage("title")}</CardTitle>
                    <CardDescription>{tPage("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <NewPasswordForm userId={user.id} />
                </CardContent>
            </Card>
        </section>
    );
}
