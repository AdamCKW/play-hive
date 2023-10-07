"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { LoginRequest, LoginValidation } from "@/lib/validators/sign-in";
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
import { ToastAction } from "../ui/toast";
import axios from "axios";

interface UserLoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserLoginFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const tValidation = useTranslations("auth.login.validation");
    const tForm = useTranslations("auth.login.form");
    const tError = useTranslations("error");

    const validationMessages: Parameters<typeof LoginValidation> = [
        tValidation("username_required"),
        tValidation("username_refine"),
        tValidation("password_required"),
    ];

    const form = useForm<LoginRequest>({
        resolver: zodResolver(LoginValidation(...validationMessages)),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginRequest) {
        setIsLoading(true);
        const signInResponse = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
            callbackUrl: linksConfig.home.href,
        });

        setIsLoading(false);

        if (signInResponse?.error) {
            if (signInResponse?.error === "notVerified") {
                return toast({
                    title: tError("heading.500"),
                    description: tError(signInResponse.error),
                    action: (
                        <ToastAction
                            onClick={() => {
                                axios
                                    .patch("/api/auth/register", {
                                        email: values.username,
                                        username: values.username,
                                        password: values.password,
                                    })
                                    .then((res) => {
                                        toast({
                                            title: tError(
                                                "resend.title_success",
                                            ),
                                            description: tError(
                                                "resend.description_success",
                                            ),
                                        });
                                    })
                                    .catch((err) => {
                                        console.log(err.response.data);
                                        toast({
                                            title: tError(
                                                "resend.title_failed",
                                            ),
                                            description: tError(
                                                err.response.data,
                                            ),
                                        });
                                    });
                            }}
                            altText="Try again"
                        >
                            Resend email
                        </ToastAction>
                    ),
                });
            }
            return toast({
                title: tError("heading.500"),
                description: tError(signInResponse.error),
            });
        }

        //TODO: temporary fix to force hard navigation
        router.refresh();
        return router.push(linksConfig.home.href);
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
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
                                            <Input
                                                id="username"
                                                placeholder={tForm(
                                                    "username.placeholder",
                                                )}
                                                autoCapitalize="none"
                                                autoComplete="username"
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
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder={tForm(
                                                        "password.placeholder",
                                                    )}
                                                    autoComplete="current-password"
                                                    autoCorrect="off"
                                                    className="pr-10"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="text-muted-foreground absolute right-0 top-0 h-full hover:text-current"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev,
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <Icons.eyeOff
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Icons.eye
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />
                                                    )}

                                                    <span className="sr-only">
                                                        {showPassword
                                                            ? tForm(
                                                                  "srPassword.hide",
                                                              )
                                                            : tForm(
                                                                  "srPassword.show",
                                                              )}
                                                    </span>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button disabled={isLoading} className="capitalize">
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {tForm("signIn")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
