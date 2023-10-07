import { useEffect } from "react";
import { toast } from "./use-toast";
import { pusherClient } from "@/lib/pusher";

type NotifySocketProps = {
    userId: string;
};

type NotifyMessage = {
    message: string;
    pathName: string;
};

export const useNotifySocket = ({ userId }: NotifySocketProps) => {
    useEffect(() => {
        pusherClient.subscribe(userId);

        pusherClient.bind("notify:user", (message: NotifyMessage) => {
            if (message.pathName !== window.location.pathname) {
                toast({
                    title: "New Message",
                    description: message.message,
                });
            }
        });

        return () => {
            pusherClient.unsubscribe(userId);
            pusherClient.unbind("notify:user");
        };
    }, [userId]);
};
