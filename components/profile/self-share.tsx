"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

import { Icons } from "../icons";
import { siteConfig } from "@/config/site";
import { useTranslations } from "next-intl";
import { getBaseUrl } from "@/lib/utils";

export default function SelfShare({
    name,
    username,
}: {
    name: string;
    username: string;
}) {
    const t = useTranslations("root.profile.self_share");

    const shareData = {
        title: siteConfig.name,
        text: t("text", { name, siteName: siteConfig.name }),
        url: `${getBaseUrl()}/${username}`,
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(`${getBaseUrl()}/${username}`);
        toast({
            title: t("copied"),
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                    {t("share")}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={copyToClipboard}>
                    {" "}
                    <Icons.link className="mr-2 h-4 w-4" />
                    {t("copy")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        navigator.share(shareData);
                    }}
                >
                    {" "}
                    <Icons.share className="mr-2 h-4 w-4" />
                    {t("share_via")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
