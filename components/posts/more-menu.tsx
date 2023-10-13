"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flag, Loader2, MoreHorizontal, Trash, UserX2 } from "lucide-react";
import { useSession } from "next-auth/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useTranslations } from "next-intl";

interface MoreMenuProps {
    id: string;
    author: string;
    name: string;
    mainPage?: boolean;
}

export default function MoreMenu({
    id,
    author,
    name,
    mainPage,
}: MoreMenuProps) {
    const tToast = useTranslations("toast");
    const tPost = useTranslations("root.posts.card.more_menu");

    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const self = session?.user.id === author;

    const handleDelete = async () => {
        setIsLoading(true);

        await axios
            .delete(`/api/posts/${id}`)
            .then((res) => {
                startTransition(() => {
                    if (pathname?.includes(`/p/${id}`)) {
                        router.push("/");
                    } else {
                        router.refresh();
                    }
                });
                setIsLoading(false);
                toast({
                    title: tToast("post.success.delete.title"),
                    description: tToast("post.success.delete.description"),
                });
            })
            .catch((error) => {
                setIsLoading(false);
                toast({
                    title: tToast("500.heading"),
                    description: error.response.data,
                    variant: "destructive",
                });
            });
    };

    const handleReport = async () => {
        await axios
            .post(`/api/posts/${id}/report`)
            .then((response) => {
                toast({
                    title: tToast("post.success.report.title"),
                    description: tToast("post.success.report.description"),
                });
                setIsLoading(false);
                setOpen(false);
            })
            .catch((error) => {
                setIsLoading(false);
                toast({
                    title: tToast("500.heading"),
                    description: error.response.data,
                    variant: "destructive",
                });
            });
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpen((prev) => !prev);
                }}
            >
                <MoreHorizontal className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {self ? (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isLoading}
                        className="!text-red-500"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash className="mr-2 h-4 w-4" />
                        )}
                        {tPost("delete")}
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleReport();
                            }}
                            disabled={isLoading}
                            className="!text-red-500"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Flag className="mr-2 h-4 w-4" />
                            )}

                            {tPost("report")}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
