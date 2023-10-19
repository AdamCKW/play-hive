import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { useTranslations } from "next-intl";
import { Mails } from "lucide-react";
import UsersList from "./users-list";
import { linksConfig } from "@/config/site";
// import UsersList from "./users-list";

interface UserFollowingBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default async function UserFollowingBar({
    className,
}: UserFollowingBarProps) {
    const session = await getAuthSession();

    const currentUser = await db.user.findUnique({
        where: {
            id: session?.user?.id,
        },
        select: {
            id: true,
            username: true,
            name: true,
            image: true,
            following: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    return (
        <>
            <aside
                className={cn(
                    "sticky top-0 h-screen overflow-auto pt-28",
                    className,
                )}
            >
                <Header />

                <UsersList users={currentUser?.following} />
            </aside>
        </>
    );
}

function Header() {
    const t = useTranslations("communication.following");

    return (
        <div className="mb-4 flex w-full justify-between px-5">
            <div className="text-2xl font-bold ">{t("heading")}</div>

            <Link
                href={linksConfig.messages.href}
                title={linksConfig.messages.title}
                className="bg-primary cursor-pointer rounded-full p-2 transition ease-out hover:opacity-75"
            >
                <span className="sr-only">{t("sr_link")}</span>

                <Mails className="text-primary-foreground h-5 w-5" />
            </Link>
        </div>
    );
}
