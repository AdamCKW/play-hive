"use client";

import { Link, Send, Share } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast, useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { getBaseUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export default function ShareButton({
    post,
    name,
}: {
    post: string;
    name: string;
}) {
    const tShare = useTranslations("root.posts.card.share");

    const shareData = {
        title: siteConfig.name,
        text: tShare("text", { name, siteName: siteConfig.name }),
        url: getBaseUrl() + "/p/" + post,
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group rounded-full hover:text-green-600 hover:dark:text-green-500">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full group-hover:bg-green-600/5 dark:group-hover:bg-green-300/20">
                        <Icons.share2 className="h-5 w-5" />
                        <span className="sr-only">{tShare("share")}</span>
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(shareData.url);
                        toast({
                            title: tShare("copied"),
                        });
                    }}
                >
                    {" "}
                    <Icons.link className="mr-2 h-4 w-4" />
                    Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.share(shareData);
                    }}
                >
                    {" "}
                    <Share className="mr-2 h-4 w-4" />
                    {tShare("share_via")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
