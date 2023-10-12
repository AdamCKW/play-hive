"use client";

import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Paperclip } from "lucide-react";
import { User as NextAuthUser } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import NSFWFilter from "nsfw-filter";

import { PostRequest, PostValidation } from "@/lib/validators/create-post";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { UserAvatar } from "@/components/user-avatar";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "@/lib/uploadthing";
import { TFile } from "@/types";
import { useTranslations } from "next-intl";
import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";

interface CreatePostProps {
    setOpen: (open: boolean) => void;
    user: Pick<User, "name" | "image" | "email" | "username" | "id">;
}

interface User extends NextAuthUser {
    username?: string | null;
}

export function CreatePost({ setOpen, user }: CreatePostProps) {
    const router = useRouter();
    const [files, setFiles] = useState<TFile[]>([]);

    const tValidation = useTranslations("root.posts.create.validation");
    const tToast = useTranslations("toast");
    const tForm = useTranslations("root.posts.create.form");

    const validationMessages: Parameters<typeof PostValidation> = [
        tValidation("content_min"),
        tValidation("content_max"),
    ];

    const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
        useDropzone({
            accept: {
                "image/*": [],
            },
            maxFiles: 4,
            maxSize: 8 * 1024 * 1024,
            onDrop: async (acceptedFiles, rejectedFiles) => {
                let isNSFW;

                for (const file of acceptedFiles) {
                    try {
                        const isSafe = await NSFWFilter.isSafe(file);

                        if (!isSafe) {
                            isNSFW = true;
                            break; // Exit the loop if NSFW content is found
                        }
                    } catch (error) {
                        return toast({
                            title: tToast("upload.error.title"),
                            description: tToast("upload.error.description"),
                        });
                    }
                }

                if (isNSFW) {
                    return toast({
                        title: tToast("upload.nsfw.title"),
                        description: tToast("upload.nsfw.description"),
                    });
                }

                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        }),
                    ),
                );

                if (rejectedFiles.length > 0 && rejectedFiles.length < 4) {
                    const exceedsSizeLimit = rejectedFiles.some(
                        (rejectedFile) => {
                            return rejectedFile.file.size > 8 * 1024 * 1024;
                        },
                    );

                    if (exceedsSizeLimit) {
                        return toast({
                            title: tToast("upload.file_size.title"),
                            description: tToast("upload.file_size.description"),
                        });
                    }
                }

                if (rejectedFiles.length > 4) {
                    return toast({
                        title: tToast("upload.file_limit.title"),
                        description: tToast("upload.file_limit.description"),
                    });
                }
            },
            noDrag: true,
        });

    const thumbs = files.map((file: TFile) => (
        <div className="mb-2 mr-2 inline-flex h-24 w-24 p-1" key={file.name}>
            <div className="flex min-w-0 overflow-hidden">
                <Image
                    alt={file.name}
                    className="block h-full w-auto"
                    src={file.preview}
                    width={100}
                    height={200}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () =>
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const queryClient = useQueryClient();

    const form = useForm<PostRequest>({
        resolver: zodResolver(PostValidation(...validationMessages)),
        defaultValues: {
            content: "",
        },
    });

    const { mutate: createPost, isLoading } = useMutation({
        mutationFn: async ({ content }: PostRequest) => {
            const payload: PostRequest = {
                content,
            };

            if (files.length > 0) {
                const res = await uploadFiles({
                    files,
                    endpoint: "imageUploader",
                });

                const newPayload = {
                    ...payload,
                    files: res.map((file: any) => file.url),
                };

                const { data } = await axios.post("/api/posts", newPayload);

                return data;
            } else {
                const { data } = await axios.post("/api/posts", payload);

                return data;
            }
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
                description: tToast("post.failed.create.description"),
                variant: "destructive",
            });
        },
        onSuccess: (content) => {
            queryClient.invalidateQueries(["posts"]);
            startTransition(() => router.refresh());
            setOpen(false);
            return toast({
                title: tToast("post.success.create.title"),
                description: tToast("post.success.create.description"),
            });
        },
    });

    function onSubmit(values: PostRequest) {
        createPost(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex space-x-2">
                    <div className="flex flex-col items-center justify-start">
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                            <UserAvatar user={user} className="h-12 w-12" />
                        </div>
                        <div className="mt-2 w-0.5 grow rounded-full bg-neutral-800" />
                    </div>
                    <div className="w-full">
                        <div className="text-left font-semibold">
                            {tForm("me")}
                        </div>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="sr-only"
                                        htmlFor="content"
                                    >
                                        {tForm("textarea.label")}
                                    </FormLabel>
                                    <FormControl>
                                        <>
                                            <Textarea
                                                className="mini-scrollbar mt-1 h-16 w-full resize-none border-none border-b-neutral-700 bg-transparent pb-1 text-base/relaxed placeholder:text-neutral-600 focus:border-b"
                                                {...field}
                                                placeholder={tForm(
                                                    "textarea.placeholder",
                                                )}
                                                maxLength={200}
                                            />
                                            <div className="mt-1 text-end text-xs font-medium text-neutral-600">
                                                {field.value.length}/200
                                            </div>
                                            <div
                                                {...getRootProps({
                                                    className: "dropzone",
                                                })}
                                            >
                                                <input {...getInputProps()} />
                                                <Paperclip className="mt-3 h-5 w-5" />
                                                <span className="sr-only">
                                                    {tForm("attach")}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex flex-row flex-wrap">
                                                {thumbs}
                                            </div>
                                        </>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="outline"
                    className="mt-4 w-full"
                    disabled={form.getValues("content").length === 0}
                    isLoading={isLoading}
                >
                    {tForm("post")}
                </Button>
            </form>
        </Form>
    );
}
