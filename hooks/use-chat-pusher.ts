import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DirectMessage } from "@prisma/client";
import { IUser } from "@/types/db";
import { pusherClient } from "@/lib/pusher";
import { get, isEmpty, set } from "lodash";

type ChatSocketProps = {
    chatId: string;
    queryKey: string;
};

type MessageWithUser = DirectMessage & IUser;

export const useChatPusher = ({ chatId, queryKey }: ChatSocketProps) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        pusherClient.subscribe(chatId);

        const addMessageHandler = (message: MessageWithUser) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                return set(
                    //object that we want to update
                    oldData,
                    //path to the property that we want to update
                    ["pages", 0, "items"], //pages[0].items
                    //value that we want to set
                    [message, ...get(oldData, ["pages", 0, "items"], [])], //message, ...oldData.pages[0].items
                );
            });
        };

        const updateMessageHandler = (message: MessageWithUser) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithUser) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        }),
                    };
                });
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        };

        pusherClient.bind("messages:new", addMessageHandler);

        pusherClient.bind("messages:update", updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(chatId);
            pusherClient.unbind("messages:new", addMessageHandler);
            pusherClient.unbind("messages:update", updateMessageHandler);
        };
    }, [chatId, queryKey]);
};
