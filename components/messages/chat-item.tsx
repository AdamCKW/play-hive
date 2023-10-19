"use client";

import * as z from "zod";
import axios from "axios";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { startTransition, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/db";
import { ActionTooltip } from "../action-tooltip";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface ChatItemProps {
    id: string;
    content: string;
    user: IUser;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentUser: IUser;
    isUpdated: boolean;
}

export const ChatItem = ({
    id,
    content,
    user,
    timestamp,
    fileUrl,
    deleted,
    currentUser,
    isUpdated,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const tMessage = useTranslations("communication.messages");
    const tToast = useTranslations("toast");

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keyDown", handleKeyDown);
    }, []);

    const fileType = fileUrl?.split(".").pop();

    const isOwner = currentUser.id === user.id;
    const canDeleteMessage = !deleted && isOwner;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;

    const onUserClick = () => {
        if (user.id === currentUser.id) return;

        router.push(`/${user.username}`);
    };

    const onMessageDelete = async () => {
        try {
            await axios
                .delete(`/api/messages/${id}`)
                .then(() => {
                    startTransition(() => {
                        router.refresh();
                    });
                })
                .catch((error) => {
                    toast({
                        title: tToast("500.heading"),
                        description: tToast(error.response?.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            toast({
                title: tToast("500.heading"),
                description: tToast("messages.failed.delete"),
                variant: "destructive",
            });
        }
    };

    return (
        <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
            <div className="group flex w-full items-start gap-x-2">
                <div
                    onClick={onUserClick}
                    className="cursor-pointer transition hover:drop-shadow-md"
                >
                    <UserAvatar user={user} />
                </div>
                <div className="flex w-full flex-col">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p
                                onClick={onUserClick}
                                className="cursor-pointer text-sm font-semibold hover:underline"
                            >
                                {user.name} {isOwner && tMessage("you")}
                            </p>
                        </div>
                        <span className="text-muted-foreground text-xs">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-secondary relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="bg-background/10 relative mt-2 flex items-center rounded-md p-2">
                            <FileIcon className="fill-background stroke-foreground h-10 w-10" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm hover:underline"
                            >
                                {tMessage("pdf")}
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                "text-sm",
                                deleted &&
                                    "text-muted-foreground mt-1 text-xs italic",
                            )}
                        >
                            {deleted ? tMessage("deleted") : content}
                        </p>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="bg-background absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border p-1 group-hover:flex">
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={() => onMessageDelete()}
                            className="ml-auto h-4 w-4 cursor-pointer transition "
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
};
