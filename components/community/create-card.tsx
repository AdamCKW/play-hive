"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { linksConfig } from "@/config/site";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface CreatePostCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function CreatePostCard({ className }: CreatePostCardProps) {
    const t = useTranslations("communication.community");
    const pathname = usePathname();

    return (
        <div className={cn("px-4 py-2", className)}>
            <Link
                href={`${pathname}${
                    linksConfig.create.disabled ? "#" : linksConfig.create.href
                }`}
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
