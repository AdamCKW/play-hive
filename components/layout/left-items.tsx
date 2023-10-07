"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

import { buttonVariants } from "../ui/button";
import { LeftBarItems } from "@/config/navigation";
import { useTranslations } from "next-intl";

type IconName = keyof typeof Icons;

export function LeftItems({}) {
    const path = usePathname();

    const tNav = useTranslations("nav");

    return (
        <>
            {LeftBarItems.map((item, index) => {
                const IconComponent = Icons[item.icon as IconName];
                return (
                    <Link
                        key={`${item.title}-${index}`}
                        href={item.disabled ? "#" : item.href}
                        className={cn(
                            item.disabled && "cursor-not-allowed opacity-80",
                            buttonVariants({
                                variant:
                                    path === item.href ? "secondary" : "ghost",
                                size: "lg",
                            }),
                            "w-full justify-start text-lg font-bold",
                        )}
                    >
                        <IconComponent className="mr-2 h-6 w-6" />
                        {tNav(item.title)}
                    </Link>
                );
            })}
        </>
    );
}
