"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/utils";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface ReportActionsProps {
    post: { id: string; name: string; username: string; reports: number };
}

export default function ReportActions({ post }: ReportActionsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const t = useTranslations("dashboard.reports.actions");
    const tToast = useTranslations("toast");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{t("open_menu")}</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("action_label")}</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => {
                        window.open(`${getBaseUrl()}/p/${post.id}`);
                    }}
                >
                    {t("open_page")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(post.id)}
                >
                    {t("copy_id")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={async () => {
                        try {
                            await axios
                                .patch("/api/d/reports", {
                                    id: post.id,
                                    action: "allow",
                                })
                                .then((response) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ["report-data"],
                                    });

                                    toast({
                                        title: tToast(
                                            "reports.success.allow.title",
                                        ),
                                        description: tToast(
                                            "reports.success.allow.description",
                                        ),
                                    });
                                })
                                .catch((error) => {
                                    toast({
                                        title: tToast("500.heading"),
                                        description: tToast(
                                            error.response.data,
                                        ),
                                        variant: "destructive",
                                    });
                                });
                        } catch (error: any) {
                            toast({
                                title: tToast("500.heading"),
                                description: tToast("500.subheading"),
                                variant: "destructive",
                            });
                        }
                    }}
                >
                    {t("allow_post")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive"
                    onClick={async () => {
                        try {
                            await axios
                                .patch("/api/d/reports", {
                                    id: post.id,
                                    action: "delete",
                                })
                                .then((response) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ["report-data"],
                                    });
                                    toast({
                                        title: tToast(
                                            "reports.success.delete.title",
                                        ),
                                        description: tToast(
                                            "reports.success.rdelete.description",
                                        ),
                                    });
                                })
                                .catch((error) => {
                                    toast({
                                        title: tToast("500.heading"),
                                        description: tToast(
                                            error.response.data,
                                        ),
                                        variant: "destructive",
                                    });
                                });
                        } catch (error: any) {
                            toast({
                                title: tToast("500.heading"),
                                description: tToast("500.subheading"),
                                variant: "destructive",
                            });
                        }
                    }}
                >
                    {t("delete_post")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
