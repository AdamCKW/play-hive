"use client";

import * as React from "react";
import { signIn, SignInResponse } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { toast } from "../../hooks/use-toast";

const oauthProviders = [
    { name: "Google", strategy: "google", icon: "google" },
    { name: "Discord", strategy: "discord", icon: "discord" },
    { name: "BattleNet", strategy: "battlenet", icon: "battlenet" },
] satisfies {
    name: string;
    strategy: string;
    icon: keyof typeof Icons;
}[];

interface OAuthSignInProps extends React.HTMLAttributes<HTMLDivElement> {}

export function OAuthSignIn({}: OAuthSignInProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function oauthSignIn(provider: string) {
        setIsLoading(true);

        try {
            await signIn(provider);
        } catch (error) {
            toast({
                title: "There is a problem.",
                description: `There was an error logging in with ${
                    provider.charAt(0).toUpperCase() + provider.slice(1)
                }. Please try again later.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function test() {
        await signIn("");
    }

    return (
        <div
            //eslint-disable-next-line
            className={`grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4`}
        >
            {oauthProviders.map((provider) => {
                const Icon = Icons[provider.icon];

                return (
                    <Button
                        aria-label={`Sign in with ${provider.name}`}
                        key={provider.strategy}
                        variant="outline"
                        className="bg-background w-full sm:w-auto"
                        disabled={isLoading}
                        onClick={() => oauthSignIn(provider.strategy)}
                    >
                        {isLoading ? (
                            <Icons.spinner
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {provider.name}
                    </Button>
                );
            })}
        </div>
    );
}
