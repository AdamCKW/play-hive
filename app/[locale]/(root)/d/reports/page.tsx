import { db } from "@/lib/db";
import { Reports, columns } from "./columns";
import { ReportsDataTable } from "@/components/data-table/reports-data-table";
import { getAuthSession } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { get, identity, map, pickBy } from "lodash";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";

interface ReportsPageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.reports");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function ReportsPage({ params }: ReportsPageProps) {
    const session = await getAuthSession();
    const t = await getTranslator(params.locale, "dashboard.reports.page");

    if (
        session?.user.role !== UserRole.ADMIN &&
        session?.user.role !== UserRole.MODERATOR
    ) {
        notFound();
    }

    const posts = await db.post.findMany({
        take: 10,
        where: {
            reports: {
                some: {
                    resolved: false,
                },
            },
        },
        include: {
            _count: {
                select: {
                    reports: true,
                },
            },
            author: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
        },
        orderBy: {
            reports: {
                _count: "desc",
            },
        },
    });

    const reportsWithPostData = map(posts, (post) => {
        return pickBy(
            {
                id: post.id,
                name: get(post, "author.name"),
                username: get(post, "author.username"),
                reports: get(post, "_count.reports", 0),
            },
            identity,
        ) as Reports;
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
            <ReportsDataTable columns={columns} data={reportsWithPostData} />
        </div>
    );
}
