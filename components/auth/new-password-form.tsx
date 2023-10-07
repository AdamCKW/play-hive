"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";
import { linksConfig } from "@/config/site";
import {
    EmailValidation,
    NewPasswordRequest,
    NewPasswordValidation,
    ResetRequest,
} from "@/lib/validators/reset-password";
import axios from "axios";

interface NewPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
    userId: string;
}

export function NewPasswordForm({
    className,
    userId,
    ...props
}: NewPasswordFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const tValidation = useTranslations("auth.reset-password.validation");
    const tForm = useTranslations("auth.reset-password.validation-form");
    const tError = useTranslations("error");

    const validationMessages: Parameters<typeof NewPasswordValidation> = [
        tValidation("password_min"),
        tValidation("password_max"),
        tValidation("password_refine"),
    ];

    const form = useForm<NewPasswordRequest>({
        resolver: zodResolver(NewPasswordValidation(...validationMessages)),
        defaultValues: {
            password: "",
        },
    });

    async function onSubmit(values: NewPasswordRequest) {
        setIsLoading(true);

        try {
            axios
                .patch(`/api/auth/reset-password/${userId}`, values)
                .then((response) => {
                    React.startTransition(() => {
                        router.push(linksConfig.signIn.href);
                    });
                    toast({
                        title: tError("reset.title_success"),
                        description: tError("reset.reset_success"),
                    });
                })
                .catch((error) => {
                    toast({
                        title: tError("reset.title_failed"),
                        description: tError(error.response.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            toast({
                title: tError("heading.500"),
                description: tError("subheading.common"),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }

        setIsLoading(false);
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        {/* Password */}

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="sr-only"
                                        htmlFor="password"
                                    >
                                        {tForm("password.label")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder={tForm(
                                                "password.placeholder",
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

                        <Button isLoading={isLoading} className="capitalize">
                            {tForm("reset")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
