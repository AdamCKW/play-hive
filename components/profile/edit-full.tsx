"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Suspense,
    startTransition,
    useEffect,
    useState,
    useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { AspectRatio } from "../ui/aspect-ratio";
import {
    FullEditRequest,
    FullEditValidation,
} from "@/lib/validators/edit-profile";
import { useTranslations } from "next-intl";
import { encryptId } from "@/lib/utils";

interface EditFullProps {
    user: User;
}

export default function EditFull({ user }: EditFullProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const tValidation = useTranslations("root.profile.settings.validation");
    const tForm = useTranslations("root.profile.settings.form");
    const tToast = useTranslations("toast");

    const validationMessages: Parameters<typeof FullEditValidation> = [
        tValidation("name_required"),
        tValidation("name_type_error"),
        tValidation("name_min"),
        tValidation("name_max"),
        tValidation("username_required"),
        tValidation("username_type_error"),
        tValidation("username_min"),
        tValidation("username_max"),
        tValidation("username_refine"),
        tValidation("email_required"),
        tValidation("email_type_error"),
        tValidation("email_invalid"),
        tValidation("email_refine"),
        tValidation("bio_max"),
        tValidation("password_refine"),
    ];

    const form = useForm<FullEditRequest>({
        resolver: zodResolver(FullEditValidation(...validationMessages)),
        defaultValues: {
            name: user.name!,
            username: user.username!,
            email: user.email!,
            bio: user.bio || "",
            password: "",
            imageUrl: user.image || "",
            imageBanner: user.cover || "",
        },
    });

    const onSubmit = async (values: FullEditRequest) => {
        setIsLoading(true);

        try {
            const encryptedId = encryptId(user.id);

            await axios
                .patch(`/api/users/${encryptedId}`, values)
                .then((response) => {
                    form.reset();
                    setIsLoading(false);
                    startTransition(() => {
                        router.push(`/${values.username}`);
                        router.refresh();
                    });
                    toast({
                        title: tToast("settings.success.title"),
                        description: tToast("settings.success.description"),
                    });
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast({
                        title: tToast("500.heading"),
                        description: tToast(error.response.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            setIsLoading(false);
            toast({
                title: tToast("500.heading"),
                description: tToast("500.subheading"),
                variant: "destructive",
            });
        }

        return (
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
                                <FormLabel>{tForm("image_label")}</FormLabel>
                                <FormControl>
                                    {field.value &&
                                    field.value?.split(".").pop() !== "pdf" ? (
                                        <div className="relative h-52 w-52">
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
                                                    {tForm("image_remove")}
                                                </span>
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <UploadDropzone
                                            endpoint="userAvatar"
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res?.[0].url);
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast({
                                                    title: tToast(
                                                        "settings.failed.image.title",
                                                    ),
                                                    description: tToast(
                                                        "settings.failed.image.description",
                                                    ),
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
                        name="imageBanner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{tForm("cover_label")}</FormLabel>
                                <FormControl>
                                    {field.value &&
                                    field.value?.split(".").pop() !== "pdf" ? (
                                        <AspectRatio
                                            ratio={16 / 9}
                                            className="relative"
                                        >
                                            <Image
                                                fill
                                                src={field.value}
                                                alt={tForm("cover_alt")}
                                            />
                                            <button
                                                onClick={() =>
                                                    field.onChange("")
                                                }
                                                className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                                                type="button"
                                            >
                                                <span className="sr-only">
                                                    {tForm("cover_remove")}
                                                </span>
                                                <X className="h-4 w-4" />
                                            </button>
                                        </AspectRatio>
                                    ) : (
                                        <UploadDropzone
                                            endpoint="userAvatar"
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res?.[0].url);
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast({
                                                    title: tToast(
                                                        "settings.failed.cover.title",
                                                    ),
                                                    description: tToast(
                                                        "settings.failed.cover.description",
                                                    ),
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
                                            user.name ||
                                            tForm("name_placeholder")
                                        }
                                        autoCapitalize="none"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        // className="ps-10"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {tForm("name_description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="username">
                                    {tForm("username_label")}
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            placeholder={
                                                user.username ||
                                                tForm("username_placeholder")
                                            }
                                            autoCapitalize="none"
                                            autoComplete="username"
                                            autoCorrect="off"
                                            className="ps-10"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <span className="text-muted-foreground absolute inset-y-0 grid w-10 place-content-center">
                                            <Icons.at className="h-4 w-4" />
                                        </span>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    {tForm("username_description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="email">
                                    {tForm("email_label")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="email"
                                        placeholder={
                                            user.email ||
                                            tForm("email_placeholder")
                                        }
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        type="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="password">
                                    {tForm("password_label")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={tForm(
                                            "password_placeholder",
                                        )}
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="bio">Profile Bio</FormLabel>
                                <FormControl>
                                    <>
                                        <Textarea
                                            id="bio"
                                            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-1 h-16 w-full resize-none"
                                            {...field}
                                            placeholder="Enter your bio (optional)"
                                            disabled={isLoading}
                                            maxLength={200}
                                        />
                                        <div className="mt-1 text-end text-xs font-medium text-neutral-600">
                                            {field?.value?.length}/160
                                        </div>
                                    </>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isLoading}
                        isLoading={isLoading}
                        className="capitalize"
                    >
                        Update
                    </Button>
                </form>
            </Form>
        );
    };
}
