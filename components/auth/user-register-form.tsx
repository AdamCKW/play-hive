"use client";

import * as React from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { RegisterRequest, RegisterValidation } from "@/lib/validators/sign-up";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";
import { linksConfig } from "@/config/site";

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({
    className,
    ...props
}: UserRegisterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const tForm = useTranslations("auth.register.form");
    const tValidation = useTranslations("auth.register.validation");
    const tToast = useTranslations("toast");

    const validationMessages: Parameters<typeof RegisterValidation> = [
        tValidation("username_required"),
        tValidation("username_type_error"),
        tValidation("username_min"),
        tValidation("username_max"),
        tValidation("username_refine"),
        tValidation("email_required"),
        tValidation("email_type_error"),
        tValidation("email_invalid"),
        tValidation("email_refine"),
        tValidation("password_min"),
        tValidation("password_max"),
        tValidation("password_refine"),
    ];

    const form = useForm<RegisterRequest>({
        resolver: zodResolver(RegisterValidation(...validationMessages)),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: RegisterRequest) {
        setIsLoading(true);
        try {
            axios
                .post("/api/auth/register", values)
                .then((response) => {
                    React.startTransition(() => {
                        router.push(linksConfig.signIn.href);
                    });
                    setIsLoading(false);
                    toast({
                        title: tToast("register.success.title"),
                        description: tToast("register.success.description"),
                    });
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast({
                        title: tToast("register.failed.title"),
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
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        {/* Username */}
                        <div className="grid gap-1">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="sr-only"
                                            htmlFor="username"
                                        >
                                            {tForm("username.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="username"
                                                    placeholder={tForm(
                                                        "username.placeholder",
                                                    )}
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div className="grid gap-1">
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
                                                placeholder="name@example.com"
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
                        </div>

                        {/* Password */}
                        <div className="grid gap-1">
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
                        </div>

                        <Button isLoading={isLoading}>{tForm("signUp")}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
