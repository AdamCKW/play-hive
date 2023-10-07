"use client";

import Link from "next/link";
import { User as NextAuthUser } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { useNotifySocket } from "@/hooks/initiate-socket";
import { linksConfig } from "@/config/site";
import { Prisma, UserRole } from "@prisma/client";
import { useTranslations } from "next-intl";

interface User extends NextAuthUser {
    username?: string | null;
    role?: string | null;
}

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
    user: Pick<User, "name" | "image" | "email" | "username" | "id" | "role">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
    const tNav = useTranslations("nav");
    useNotifySocket({ userId: user.id });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={{
                        name: user.name!,
                        image: user.image!,
                    }}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="item-center flex justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && (
                            <p className="font-medium">{user.name}</p>
                        )}
                        {user.username && (
                            <p className="text-muted-foreground w-[200px] truncate text-sm">
                                {user.username}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={`/${user.username}`}>
                        {tNav(linksConfig.reports.title)}
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href={`/${user.username}/${linksConfig.settings.href}`}
                    >
                        {tNav(linksConfig.reports.title)}
                    </Link>
                </DropdownMenuItem>

                {user.role === UserRole.ADMIN ||
                user.role === UserRole.MODERATOR ? (
                    <DropdownMenuItem asChild>
                        <Link href={linksConfig.reports.href}>
                            {tNav(linksConfig.reports.title)}
                        </Link>
                    </DropdownMenuItem>
                ) : null}

                {user.role === UserRole.ADMIN && (
                    <DropdownMenuItem asChild>
                        <Link href={linksConfig.manage.href}>
                            {tNav(linksConfig.reports.title)}
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault();
                        signOut();
                    }}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
