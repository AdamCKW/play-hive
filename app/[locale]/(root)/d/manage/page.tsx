import { db } from "@/lib/db";
import { Users, columns } from "./columns";

import { ManageDataTable } from "@/components/data-table/manage-data-table";
import { getAuthSession } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";

interface ManagePageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.manage");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function ManagePage({ params }: ManagePageProps) {
    const session = await getAuthSession();
    const t = await getTranslator(params.locale, "dashboard.manage.page");

    if (session?.user.role !== UserRole.ADMIN) {
        notFound();
    }

    const users = await db.user.findMany({
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
        },
        take: 10,
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("heading")}
                    </h2>
                    <p className="text-muted-foreground">{t("subheading")}</p>
                </div>
            </div>
            <ManageDataTable columns={columns} data={users} />
        </div>
    );
}
