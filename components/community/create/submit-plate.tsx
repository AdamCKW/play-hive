"use client";

import { usePlateStore } from "@udecode/plate-common";
import { Button } from "../../plate-ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "../../../hooks/use-toast";
import { PostCreationRequest } from "@/lib/validators/community-post";
import React from "react";
import { ToolbarButton } from "@/components/plate-ui/toolbar";

interface SubmitPlateProps {
    output: {
        communityId: string;
        content: any;
    };
}

export default function SubmitPlate({ output }: SubmitPlateProps) {
    const setReadOnly = usePlateStore().set.readOnly();
    const router = useRouter();
    const pathname = usePathname();
    const { mutate: createPost } = useMutation({
        mutationFn: async ({ communityId, content }: PostCreationRequest) => {
            const payload: PostCreationRequest = {
                communityId,
                content,
            };
            const { data } = await axios.post(
                "/api/community/post/create",
                payload,
            );
            return data;
        },
        onMutate: () => {
            setReadOnly(true);
        },
        onError: (err) => {
            setReadOnly(false);
            if (err instanceof AxiosError) {
                return toast({
                    title: "Something went wrong.",
                    description: err.response?.data as string,
                    variant: "destructive",
                });
            }

            return toast({
                title: "Something went wrong.",
                description: "Your post was not created. Please try again.",
                variant: "destructive",
            });
        },
        onSuccess: () => {
            // turn pathname /c/mycommunity/submit into /c/mycommunity
            const newPathname = pathname!.split("/").slice(0, -1).join("/");
            router.push(newPathname);

            router.refresh();

            return toast({
                description: "Your post has been created.",
            });
        },
    });
    return (
        <ToolbarButton
            className="w-full"
            onClick={async () => {
                console.log(output);
                const payload: PostCreationRequest = {
                    communityId: output.communityId,
                    content: output.content,
                };
                await createPost(payload);
            }}
        >
            Create Post
        </ToolbarButton>
    );
}
