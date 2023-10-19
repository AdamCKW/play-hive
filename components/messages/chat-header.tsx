import { Hash } from "lucide-react";

import { IUser } from "@/types/db";
import { UserAvatar } from "../user-avatar";
import Link from "next/link";
import { Icons } from "../icons";
import { linksConfig } from "@/config/site";

interface ChatHeaderProps {
    user: IUser;
}

export const ChatHeader = ({ user }: ChatHeaderProps) => {
    return (
        <div className="flex w-full items-center justify-between border-b px-4 py-3 shadow-sm sm:px-4 lg:px-6">
            <div className="flex items-center gap-3">
                <Link
                    href={linksConfig.messages.href}
                    className="text-primary hover:text-primary/90 block cursor-pointer transition lg:hidden"
                >
                    <Icons.chevronLeft size={32} />
                </Link>
                <UserAvatar
                    user={user}
                    className="mr-2 h-8 w-8 md:h-8 md:w-8"
                />

                <div className="flex flex-col">
                    <div>{user.name}</div>
                    <div className="text-muted-foreground text-sm font-light">
                        {user.username}
                    </div>
                </div>
            </div>
        </div>
    );
};
