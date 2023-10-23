"use client";

import { BottomBarItems, LeftBarItems } from "@/config/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";
import { is } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useModal } from "@/hooks/use-modal-store";
import { Edit } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { Fragment } from "react";

type IconName = keyof typeof Icons;
export function Bottombar() {
    const path = usePathname();
    const tNav = useTranslations("nav");
    const t = useTranslations("root.posts.create.modal");
    const { onOpen } = useModal();

    const { data: session } = useSession();

    return (
        <div className="fixed bottom-0 z-50 flex w-full items-center justify-around bg-inherit p-3 pb-4 md:hidden">
            {BottomBarItems.map((item, index) => {
                const IconComponent = Icons[item.icon as IconName];

                if (index === 2) {
                    return (
                        <Fragment key={`${item.title}_${index}`}>
                            <Link
                                href={item.disabled ? "#" : item.href}
                                className={cn(
                                    item.disabled &&
                                        "cursor-not-allowed opacity-80",
                                )}
                            >
                                <IconComponent
                                    className={`h-6 w-6 ${
                                        path === item.href
                                            ? ""
                                            : "text-muted-foreground"
                                    }`}
                                />
                                <span className="sr-only">
                                    {tNav(item.title)}
                                </span>
                            </Link>
                        </Fragment>
                    );
                }

                return (
                    <Link
                        key={`${item.title}-${index}`}
                        href={item.disabled ? "#" : item.href}
                        className={cn(
                            item.disabled && "cursor-not-allowed opacity-80",
                        )}
                    >
                        <IconComponent
                            className={`h-6 w-6 ${
                                path === item.href
                                    ? ""
                                    : "text-muted-foreground"
                            }`}
                        />
                        <span className="sr-only">{tNav(item.title)}</span>
                    </Link>
                );
            })}
            {session?.user && (
                <button
                    onClick={() => {
                        onOpen("createPost", {
                            user: session.user,
                        });
                    }}
                >
                    <Edit className="text-muted-foreground h-6 w-6" />
                    <span className="sr-only">{t("button")}</span>
                </button>
            )}
        </div>
    );
}
