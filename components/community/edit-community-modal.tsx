"use client";

import { useState, startTransition, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { set } from "zod";
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal-store";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    CommunityValidator,
    CreateCommunityPayload,
} from "@/lib/validators/community";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { FileUpload } from "../file-upload";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";

interface CommunityModalProps {}

export default function EditCommunityModal({}: CommunityModalProps) {
    const { isOpen, onClose, type, data } = useModal();
    const { community } = data;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = isOpen && type === "editCommunity";
    const router = useRouter();
    const tForm = useTranslations("communication.community.form");
    const tValidation = useTranslations("communication.community.validation");
    const tToast = useTranslations("toast");

    const validationMessages: Parameters<typeof CommunityValidator> = [
        tValidation("name_required"),
        tValidation("name_type_error"),
        tValidation("name_min"),
        tValidation("name_max"),
        tValidation("name_refine"),
    ];

    const form = useForm<CreateCommunityPayload>({
        resolver: zodResolver(CommunityValidator(...validationMessages)),
        defaultValues: {
            imageUrl: data?.community?.image || "",
            name: data?.community?.name || "",
        },
    });

    useEffect(() => {
        if (community) {
            form.setValue("name", community.name);
            form.setValue("imageUrl", community.image || "");
        }
    }, [community, form]);

    const onSubmit = async (values: CreateCommunityPayload) => {
        setIsLoading(true);

        try {
            await axios
                .patch(`/api/community/${data.community?.id}`, values)
                .then((res) => {
                    form.reset();
                    onClose();
                    startTransition(() => {
                        router.push(`/c/${res.data}`);
                    });
                    toast({
                        title: tToast("community.success.edit.title"),
                        description: tToast(
                            "community.success.edit.description",
                        ),
                    });
                })
                .catch((err) => {
                    setIsLoading(false);
                    toast({
                        title: tToast("500.heading"),
                        description: tToast(err.response?.data),
                        variant: "destructive"
                    });
                });
        } catch (error) {
            setIsLoading(false);
            toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive"
            });
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-3">
                        {tForm("title_update")}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {tForm("image_label")}
                                    </FormLabel>
                                    <FormControl>
                                        {field.value &&
                                        field.value?.split(".").pop() !==
                                            "pdf" ? (
                                            <div className="flex items-center justify-center">
                                                <div className="relative h-32 w-32">
                                                    <Image
                                                        fill
                                                        src={field.value}
                                                        alt={tForm("image_alt")}
                                                        className="rounded-full"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            field.onChange("")
                                                        }
                                                        className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                                                        type="button"
                                                    >
                                                        <span className="sr-only">
                                                            {tForm(
                                                                "image_remove",
                                                            )}
                                                        </span>
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <UploadDropzone
                                                className="h-52"
                                                endpoint="communityImage"
                                                onClientUploadComplete={(
                                                    res,
                                                ) => {
                                                    field.onChange(
                                                        res?.[0].url,
                                                    );
                                                }}
                                                onUploadError={(
                                                    error: Error,
                                                ) => {
                                                    toast({
                                                        title: tToast(
                                                            "upload.error_upload.title",
                                                        ),
                                                        description: tToast(
                                                            "upload.error_upload.title",
                                                        ),
                                                        variant: "destructive",
                                                    });
                                                }}
                                            />
                                        )}
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        {tForm("name_label")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder={
                                                data?.community?.name ||
                                                tForm("name_placeholder")
                                            }
                                            autoCapitalize="none"
                                            autoComplete="name"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            isLoading={isLoading}
                            className="w-full capitalize"
                        >
                            {tForm("update_button")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
