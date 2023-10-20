"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { IUser } from "@/types/db";
import { getBaseUrl } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface ManageActionsProps {
    user: {
        id: string;
        name: string | null;
        username: string | null;
        email: string | null;
        role: UserRole;
    };
}

export default function ManageActions({ user }: ManageActionsProps) {
    const t = useTranslations("dashboard.manage.actions");
    const tToast = useTranslations("toast");
    const router = useRouter();
    const queryClient = useQueryClient();

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
                        window.open(`${getBaseUrl()}/${user.username}`);
                    }}
                >
                    {t("open_profile")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={async () => {
                        try {
                            await axios
                                .patch("/api/d/manage", {
                                    id: user.id,
                                    action: "promote_admin",
                                })
                                .then((response) => {
                                    startTransition(() => {
                                        router.refresh();
                                        queryClient.invalidateQueries({
                                            queryKey: ["manage-data"],
                                        });
                                    });
                                    toast({
                                        title: tToast(
                                            "manage.success.role_admin.title",
                                        ),
                                        description: tToast(
                                            "manage.success.role_admin.description",
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
                    {t("promote_admin")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        try {
                            await axios
                                .patch("/api/d/manage", {
                                    id: user.id,
                                    action: "promote_moderator",
                                })
                                .then((response) => {
                                    startTransition(() => {
                                        router.refresh();
                                        queryClient.invalidateQueries({
                                            queryKey: ["manage-data"],
                                        });
                                    });
                                    toast({
                                        title: tToast(
                                            "manage.success.role_mod.title",
                                        ),
                                        description: tToast(
                                            "manage.success.role_mod.description",
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
                    {user.role === "ADMIN"
                        ? t("demote_to_mod")
                        : user.role === "USER" || user.role === "MODERATOR"
                        ? t("promote_mod")
                        : t("unban_user")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-yellow-500"
                    onClick={async () => {
                        try {
                            await axios
                                .patch("/api/d/manage", {
                                    id: user.id,
                                    action: "promote_user",
                                })
                                .then((response) => {
                                    startTransition(() => {
                                        router.refresh();
                                        queryClient.invalidateQueries({
                                            queryKey: ["manage-data"],
                                        });
                                    });
                                    toast({
                                        title: tToast(
                                            "manage.success.role_user.title",
                                        ),
                                        description: tToast(
                                            "manage.success.role_user.description",
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
                    {user.role === "BANNED"
                        ? t("unban_user")
                        : t("demote_to_user")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive"
                    onClick={async () => {
                        try {
                            await axios
                                .patch("/api/d/manage", {
                                    id: user.id,
                                    action: "ban_user",
                                })
                                .then((response) => {
                                    startTransition(() => {
                                        router.refresh();
                                        queryClient.invalidateQueries({
                                            queryKey: ["manage-data"],
                                        });
                                    });
                                    toast({
                                        title: tToast(
                                            "manage.success.role_ban.title",
                                        ),
                                        description: tToast(
                                            "manage.success.role_ban.description",
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
                    {t("ban_user")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
