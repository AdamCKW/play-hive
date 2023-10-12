import { EditFull } from "@/components/profile/edit-full";
import EditLimited from "@/components/profile/edit-limited";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslator } from "next-intl/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface SettingsPageProps {
    params: {
        username: string;
        locale: string;
    };
}
export default async function SettingsPage({ params }: SettingsPageProps) {
    const session = await getAuthSession();
    if (!session) return redirect("/login");

    const t = await getTranslator(params.locale, "root.profile.settings");

    if (params.username !== session.user.username)
        return redirect(`/${params.username}`);

    const getUser = await db.user.findUnique({
        where: {
            username: params.username,
        },
    });

    if (!getUser) notFound();

    const getAccounts = await db.account.findFirst({
        where: {
            userId: getUser.id || session.user.id,
        },
    });

    if (getAccounts) {
        return (
            <div>
                <EditLimited user={getUser} />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-3 py-4">
            <div>
                <h3 className="text-lg font-medium">{t("heading")}</h3>
                <p className="text-muted-foreground text-sm">
                    {t("subheading")}
                </p>
            </div>
            <Separator />

            <EditFull user={getUser} />
        </div>
    );
}
