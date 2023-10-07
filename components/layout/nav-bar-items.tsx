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

interface MainNavProps {}

type IconName = keyof typeof Icons;

export function NavbarItems({}: MainNavProps) {
    const tNav = useTranslations("nav");

    return (
        <div>
            <nav className="flex items-center space-x-1">
                {NavBarItems.map((item, index) => {
                    const IconComponent = Icons[item.icon as IconName];

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
                                {/* <span className="relative inline-block">
                                   
                                </span> */}
                                <IconComponent className="h-5 w-5" />

                                <span className="sr-only">
                                    {tNav(item.title)}
                                </span>
                            </div>
                        </Link>
                    );
                })}

                <LocaleSwitch />
                <ThemeToggle />
            </nav>
        </div>
    );
}
