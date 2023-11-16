"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { linksConfig } from "@/config/site";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface CreatePostButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function CreatePostButton({ className }: CreatePostButtonProps) {
    const [path, setPath] = useState<string>("");
    const t = useTranslations("communication.community");
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes("/create")) {
            setPath(pathname);
        } else {
            setPath(
                `${pathname}${
                    linksConfig.create.disabled ? "#" : linksConfig.create.href
                }`,
            );
        }
    }, []);

    return (
        <div className={cn("px-4 py-2", className)}>
            <Link
                href={path}
                className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full text-lg font-bold",
                )}
            >
                {t("create_post")}
            </Link>
        </div>
    );
}
