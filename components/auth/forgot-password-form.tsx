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
import { EmailValidation, ResetRequest } from "@/lib/validators/reset-password";
import axios from "axios";

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({
    className,
    ...props
}: ResetPasswordFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const tValidation = useTranslations("auth.forgot_password.validation");
    const tForm = useTranslations("auth.forgot_password.form");
    const tError = useTranslations("toast");

    const validationMessages: Parameters<typeof EmailValidation> = [
        tValidation("email_required"),
        tValidation("email_type_error"),
        tValidation("email_invalid"),
        tValidation("email_refine"),
    ];

    const form = useForm<ResetRequest>({
        resolver: zodResolver(EmailValidation(...validationMessages)),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: ResetRequest) {
        setIsLoading(true);

        try {
            axios
                .post("/api/auth/forgot-password", values)
                .then((response) => {
                    React.startTransition(() => {
                        router.push(linksConfig.signIn.href);
                    });
                    toast({
                        title: tError("reset.success.title"),
                        description: tError("reset.success.description"),
                        variant: "destructive"
                    });
                })
                .catch((error) => {
                    toast({
                        title: tError("reset.failed.title"),
                        description: tError(error.response.data),
                        variant: "destructive",
                    });
                });
        } catch (error) {
            toast({
                title: tError("500.heading"),
                description: tError("500.subheading"),
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
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="sr-only"
                                        htmlFor="email"
                                    >
                                        {tForm("email.label")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder={tForm(
                                                "email.placeholder",
                                            )}
                                            autoCapitalize="none"
                                            autoComplete="email"
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
