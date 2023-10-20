import * as React from "react";
import Link from "next/link";

import { NavItem } from "@/types/index";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NavBarItems } from "@/config/navigation";
import { useTranslations } from "next-intl";
import { LocaleSwitch } from "./locale-switch";
import { User as NextAuthUser } from "next-auth";
import { Search } from "./search";

interface User extends NextAuthUser {
    username?: string | null;
    role?: string | null;
}

interface MainNavProps {
    user: Pick<User, "name" | "image" | "email" | "username" | "id" | "role">;
}

type IconName = keyof typeof Icons;

export function NavbarItems({ user }: MainNavProps) {
    const tNav = useTranslations("nav");

    return (
        <div>
            <nav className="flex items-center space-x-1">
                {/* {NavBarItems.map((item, index) => {
                    const IconComponent = Icons[item.icon as IconName];
                    if (item.title === "profile") {
                        return (
                            <Link
                                key={`${item.title}-${index}`}
                                href={item.disabled ? "#" : `/${user.username}`}
                                className={cn(
                                    item.disabled &&
                                        "cursor-not-allowed opacity-80",
                                )}
                            >
                                <div
                                    className={buttonVariants({
                                        size: "sm",
                                        variant: "ghost",
                                    })}
                                >
                                    <IconComponent className="h-5 w-5" />

                                    <span className="sr-only">
                                        {tNav(item.title)}
                                    </span>
                                </div>
                            </Link>
                        );
                    }
                    return (
                        <Link
                            key={`${item.title}-${index}`}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                item.disabled &&
                                    "cursor-not-allowed opacity-80",
                            )}
                        >
                            <div
                                className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                })}
                            >
                                <IconComponent className="h-5 w-5" />

                                <span className="sr-only">
                                    {tNav(item.title)}
                                </span>
                            </div>
                        </Link>
                    );
                })} */}
                <Search />
                <LocaleSwitch />
                <ThemeToggle />
            </nav>
        </div>
    );
}
