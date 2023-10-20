"use client";

import axios from "axios";
import { ElementRef, FC, Fragment, useEffect, useRef, useState } from "react";
import { IUser } from "@/types/db";
import { format } from "date-fns";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Icons } from "../icons";
import { DirectMessage } from "@prisma/client";
import { useChatPusher } from "../../hooks/use-chat-pusher";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ChatItem } from "./chat-item";
import { useTranslations } from "next-intl";

interface ChatBodyProps {
    user: IUser;
    currentUser: IUser;
    chatId: string;
    paramValue: string;
    socketUrl: string;
    socketQuery: Record<string, any>;
}

type MessageWithUser = DirectMessage & {
    user: IUser;
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export default function ChatBody({
    user,
    currentUser,
    chatId,
    paramValue,
}: ChatBodyProps) {
    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const queryKey = `chat:${chatId}`;
    const t = useTranslations("communication.messages");

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl: "/api/messages",
            paramValue,
        });

    useChatPusher({ chatId, queryKey });

    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length,
    });

    if (status === "loading") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Icons.loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t("loading")}
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Icons.serverCrash className="my-4 h-7 w-7 text-zinc-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t("something_wrong")}
                </p>
            </div>
        );
    }

    return (
        <div
            ref={chatRef}
            className="flex h-full max-h-[calc(100dvh-20rem)] flex-1 flex-col overflow-y-auto py-4 md:max-h-[calc(100dvh-18rem)]"
        >
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && (
                <div className="mb-4 space-y-2 px-4">
                    <p className="text-xl font-bold md:text-3xl">{user.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {t("description", { name: user.name })}
                    </p>
                </div>
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Icons.loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        >
                            {t("load_previous")}
                        </button>
                    )}
                </div>
            )}
            <div className="mt-auto flex flex-col-reverse">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithUser) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentUser={currentUser}
                                user={message.user}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(
                                    new Date(message.createdAt),
                                    DATE_FORMAT,
                                )}
                                isUpdated={
                                    message.updatedAt !== message.createdAt
                                }
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    );
}
