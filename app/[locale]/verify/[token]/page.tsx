import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/db";
import { getTranslator } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { startTransition } from "react";

interface VerificationPageProps {
    params: {
        locale: string;
        token: string;
    };
}

export default async function VerificationPage({
    params: { locale, token },
}: VerificationPageProps) {
    if (!token) notFound();

    const tValidation = await getTranslator(locale, "validation");

    const user = await db.user.findFirst({
        where: {
            verificationToken: token,
        },
        select: {
            username: true,
            verificationToken: true,
        },
    });

    if (!user) {
        notFound();
    }

    const response = await db.user.update({
        where: {
            username: user.username!,
        },
        data: {
            emailVerified: new Date(),
            verificationToken: null,
        },
    });

    if (response) {
        startTransition(() => redirect("/sign-in"));
        toast({
            title: tValidation("success.title"),
            description: tValidation("success.description"),
        });
    }

    return (
        <div className="container">
            <p>{tValidation("success.loading")}</p>
        </div>
    );
}
