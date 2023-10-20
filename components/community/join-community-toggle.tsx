"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { SubscribeToCommunityPayload } from "@/lib/validators/community";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

interface SubscribeLeaveToggleProps {
    isSubscribed: boolean;
    communityId: string;
    communityName: string;
}

export default function JoinCommunityToggle({
    isSubscribed,
    communityId,
    communityName,
}: SubscribeLeaveToggleProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tToast = useTranslations("toast");

    const tButton = useTranslations("communication.community.actions");

    const subscribe = async () => {
        setIsLoading(true);
        try {
            await axios
                .post(`/api/community/${communityId}/subscribe`)
                .then((res) => {
                    startTransition(() => {
                        router.refresh();
                        setIsLoading(false);
                    });
                    toast({
                        title: tToast("community.success.subscribe.title"),
                        description: tToast(
                            "community.success.subscribe.description",
                            {
                                name: communityName,
                            },
                        ),
                    });
                })
                .catch((err) => {
                    setIsLoading(false);
                    return toast({
                        title: tToast("500.heading"),
                        description: tToast(err.response?.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            setIsLoading(false);
            return toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive",
            });
        }
    };

    const unsubscribe = async () => {
        setIsLoading(true);
        try {
            await axios
                .post(`/api/community/${communityId}/unsubscribe`)
                .then((res) => {
                    startTransition(() => {
                        router.refresh();
                        setIsLoading(false);
                    });
                    toast({
                        title: tToast("community.success.unsubscribe.title"),
                        description: tToast(
                            "community.success.unsubscribe.description",
                            {
                                name: communityName,
                            },
                        ),
                    });
                })
                .catch((err) => {
                    setIsLoading(false);
                    return toast({
                        title: tToast("500.heading"),
                        description: tToast(err.response?.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            setIsLoading(false);
            return toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            onClick={(e) => {
                if (isSubscribed) {
                    unsubscribe();
                } else {
                    subscribe();
                }
            }}
            className="w-full"
            variant="outline"
            isLoading={isLoading}
        >
            {isSubscribed ? tButton("unsubscribe") : tButton("subscribe")}
        </Button>
    );
}
