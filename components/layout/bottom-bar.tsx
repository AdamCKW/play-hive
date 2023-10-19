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
        // <section className="bg-glassmorphism xs:px-7 fixed bottom-0 z-10 w-full rounded-t-3xl p-4 backdrop-blur-lg md:hidden">
        //     <div className="xs:gap-5 flex items-center justify-between gap-3">
        //         {LeftBarItems.map((item, index) => {
        //             const isActive = pathname === item.href;

        //             const IconComponent = Icons[item.icon as IconName];
        //             return (
        //                 <Link
        //                     key={`${item.title}-${index}`}
        //                     href={item.disabled ? "#" : item.href}
        //                     className={cn(
        //                         item.disabled &&
        //                             "cursor-not-allowed opacity-80",
        //                         isActive && "bg-primary",
        //                         "relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5",
        //                     )}
        //                 >
        //                     <IconComponent className="h-6 w-6" />
        //                     <span className="sr-only">{tNav(item.title)}</span>
        //                 </Link>
        //             );
        //         })}
        //     </div>
        // </section>
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

                            {session?.user && (
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        onOpen("createPost", {
                                            user: session.user,
                                        });
                                    }}
                                >
                                    <Edit className="text-muted-foreground h-6 w-6" />
                                    <span className="sr-only">
                                        {t("button")}
                                    </span>
                                </Button>
                            )}
                        </Fragment>
                    );
                }

                if (item.title === "profile") {
                    return (
                        <Link
                            key={`${item.title}-${index}`}
                            href={
                                item.disabled
                                    ? "#"
                                    : `/${session?.user.username}`
                            }
                            className={cn(
                                item.disabled &&
                                    "cursor-not-allowed opacity-80",
                            )}
                        >
                            <UserAvatar
                                className="h-6 w-6 text-xs"
                                user={{
                                    name: session?.user.name!,
                                    image: session?.user.image!,
                                }}
                            />
                            <span className="sr-only">{tNav(item.title)}</span>
                        </Link>
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
        </div>
    );
}
