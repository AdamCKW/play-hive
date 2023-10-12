"use client";

import {
    MouseEvent,
    ReactEventHandler,
    startTransition,
    use,
    useTransition,
} from "react";
import { revalidatePath } from "next/cache";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { toast } from "../../hooks/use-toast";
import { encryptId } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function FollowButton({
    isFollowing,
    name,
    id,
    followingId,
}: {
    isFollowing: boolean;
    name: string;
    id: string;
    followingId: string;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const tToast = useTranslations("toast");
    const tButton = useTranslations("root.profile.follow_button");

    const { mutate: follow, isLoading: isFollowLoading } = useMutation({
        mutationFn: async () => {
            const encryptedId = encryptId(followingId);

            const { data } = await axios.patch(
                `/api/users/${encryptedId}/follow`,
            );
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                return toast({
                    title: tToast("500.heading"),
                    description: tToast(err.response?.data),
                    variant: "destructive",
                });
            }

            return toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive",
            });
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            });
            toast({
                title: tToast("following.success.following.title"),
                description: tToast("following.success.following.description", {
                    name,
                }),
            });
        },
    });

    const { mutate: unfollow, isLoading: isUnfollowLoading } = useMutation({
        mutationFn: async () => {
            const encryptedId = encryptId(followingId);
            const { data } = await axios.patch(
                `/api/users/${encryptedId}/unfollow`,
            );
            return data as string;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                return toast({
                    title: tToast("500.heading"),
                    description: tToast(err.response?.data),
                    variant: "destructive",
                });
            }

            return toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive",
            });
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            });
            toast({
                title: tToast("following.success.unfollow.title"),
                description: tToast("following.success.unfollow.description", {
                    name,
                }),
            });
        },
    });

    return isFollowing ? (
        <Button
            className="w-full"
            variant="outline"
            isLoading={isUnfollowLoading}
            onClick={() => unfollow()}
        >
            {tButton("following")}
        </Button>
    ) : (
        <Button
            className="w-full"
            variant="outline"
            isLoading={isFollowLoading}
            onClick={() => follow()}
        >
            {tButton("follow")}
        </Button>
    );
}
