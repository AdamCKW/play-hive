import TimerRedirect from "@/components/timer-redirect";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/db";
import { getTranslator } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { startTransition } from "react";

interface VerificationPageProps {
    params: {
        locale: string;
    };
    searchParams: {
        [key: string]: string | undefined;
    };
}

export default async function VerificationPage({
    params: { locale },
    searchParams: { token },
}: VerificationPageProps) {
    if (!token) {
        notFound();
    }

    const tVerification = await getTranslator(locale, "verification");

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
        return notFound();
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

    if (!response) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="">{tVerification("error.title")}</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <TimerRedirect />
        </div>
    );
}
