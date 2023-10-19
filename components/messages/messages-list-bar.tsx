import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { useTranslations } from "next-intl";
import { Mails, UserPlus } from "lucide-react";
import UsersList from "./users-list";
import { linksConfig } from "@/config/site";
import MessagesList from "./messages-list";
import path from "path";
import { headers } from "next/headers";
import { he } from "date-fns/locale";
interface UserMessagesBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default async function UserMessagesBar({
    className,
}: UserMessagesBarProps) {
    const session = await getAuthSession();

    const conversationList = await db.conversation.findMany({
        where: {
            OR: [
                {
                    userOneId: session?.user.id,
                },
                {
                    userTwoId: session?.user.id,
                },
            ],
        },
        include: {
            userOne: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
            userTwo: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
        },
    });

    const conversationsWithOtherUsers = conversationList.map((conversation) => {
        const currentUserID = session?.user.id;
        const otherUser =
            conversation.userOne.id === currentUserID
                ? conversation.userTwo
                : conversation.userOne;

        return otherUser;
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

                <MessagesList users={conversationsWithOtherUsers} />
            </aside>
        </>
    );
}

function Header() {
    const t = useTranslations("communication.messages");

    return (
        <div className="mb-4 flex w-full justify-between px-5">
            <div className="text-2xl font-bold ">{t("heading")}</div>

            <Link
                href={linksConfig.following.href}
                title={linksConfig.following.title}
                className="bg-primary cursor-pointer rounded-full p-2 transition ease-out hover:opacity-75"
            >
                <span className="sr-only">{t("sr_link")}</span>

                <UserPlus className="text-primary-foreground h-5 w-5" />
            </Link>
        </div>
    );
}
