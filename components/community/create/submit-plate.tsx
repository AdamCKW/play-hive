"use client";

import { Value, usePlateStore } from "@udecode/plate-common";
import { Button } from "../../plate-ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "../../../hooks/use-toast";
import React, { startTransition } from "react";
import { ToolbarButton } from "@/components/plate-ui/toolbar";
import { useTranslations } from "next-intl";
import { PostCreationRequest } from "@/lib/validators/create-community-post";
import { Icons } from "@/components/icons";
import { set } from "date-fns";

interface SubmitPlateProps {
    output: {
        communityId: string;
        content: Value;
    };
}

export default function SubmitPlate({ output }: SubmitPlateProps) {
    const t = useTranslations("communication.community.post_editor");
    const setReadOnly = usePlateStore().set.readOnly();
    const { communityId, content } = output;
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const tToast = useTranslations("toast");

    const handleSubmit = async () => {
        setIsLoading(true);
        setReadOnly(true);
        try {
            await axios
                .post(`/api/community/${communityId}`, {
                    content,
                })
                .then((res) => {
                    const newPathname = pathname!
                        .split("/")
                        .slice(0, -1)
                        .join("/");

                    toast({
                        title: tToast("post.success.create.title"),
                        description: tToast("post.success.create.description"),
                    });
                    startTransition(() => {
                        router.push(newPathname);
                        router.refresh();
                    });
                })
                .catch((err) => {
                    setIsLoading(false);
                    setReadOnly(false);
                    return toast({
                        title: tToast("500.heading"),
                        description: tToast(err.response?.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            setIsLoading(false);
            setReadOnly(false);
            toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
            });
        }
    };

    return (
        <ToolbarButton
            disabled={isLoading}
            className="w-full"
            onClick={() => handleSubmit()}
        >
            {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("create_button")}
        </ToolbarButton>
    );
}
