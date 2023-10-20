"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import { Community, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Skeleton } from "../ui/skeleton";
import { UserAvatar } from "../user-avatar";
import { useTranslations } from "next-intl";

export function Search() {
    const [open, setOpen] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const t = useTranslations("search");
    const commandRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const isLg = useMediaQuery("(min-width: 1024px)");

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (!open) {
            setInput("");
        }
    }, [open]);

    const {
        data: queryResults,
        refetch,
        isFetched,
        isFetching,
        isLoading,
    } = useQuery({
        queryFn: async () => {
            if (!input) return [];
            const { data } = await axios.get(`/api/search?q=${input}`);

            return data;
        },
        queryKey: ["search-users"],
        enabled: false,
    });

    const request = debounce(async () => {
        await refetch();
    }, 300);

    const debounceRequest = useCallback(() => {
        request();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Button
                variant={isLg ? "outline" : "ghost"}
                className="relative h-9 w-9 p-0 lg:h-10 lg:w-60 lg:justify-start lg:px-3 lg:py-2"
                onClick={() => setOpen(true)}
            >
                <Icons.search className="h-4 w-4 lg:mr-2" aria-hidden="true" />
                <span className="hidden lg:inline-flex">{t("label")}</span>
                <span className="sr-only">{t("sr_label")}</span>
                <kbd className="bg-muted pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
                    <abbr title={"Control"}>{"Ctrl+"}</abbr>K
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    isLoading={isFetching}
                    onValueChange={(text) => {
                        setInput(text);
                        debounceRequest();
                    }}
                    value={input}
                    placeholder={t("placeholder")}
                />

                {input.length > 0 && (
                    <CommandList>
                        <CommandEmpty
                            className={cn(
                                isFetching
                                    ? "hidden"
                                    : "py-6 text-center text-sm",
                            )}
                        >
                            {t("no_results")}
                        </CommandEmpty>

                        {isFetching ? (
                            <div className="space-y-1 overflow-hidden px-1 py-2">
                                <Skeleton className="h-4 w-10 rounded" />
                                <Skeleton className="h-9 rounded-sm" />
                                <Skeleton className="h-9 rounded-sm" />
                            </div>
                        ) : (
                            <>
                                {queryResults?.users?.length > 0 && (
                                    <CommandGroup heading="Users" key="users">
                                        {queryResults?.users.map(
                                            (user: User) => (
                                                <CommandItem
                                                    onSelect={(e) => {
                                                        router.push(
                                                            `/${user.username}`,
                                                        );
                                                        setOpen(false);
                                                        router.refresh();
                                                    }}
                                                    key={user.username!}
                                                    value={`${user.username!}_${user.name!}`}
                                                >
                                                    <UserAvatar
                                                        user={{
                                                            name: user.name!,
                                                            image: user.image!,
                                                        }}
                                                    />
                                                    <div className="ml-2 flex w-full items-center gap-2">
                                                        <p className="w-32 truncate font-semibold sm:w-52 md:w-64">
                                                            {user.name}
                                                        </p>

                                                        <p className="text-muted-foreground ml-auto w-32 truncate text-sm sm:w-36">
                                                            @{user.username}
                                                        </p>
                                                    </div>
                                                </CommandItem>
                                            ),
                                        )}
                                    </CommandGroup>
                                )}

                                {queryResults?.communities?.length > 0 && (
                                    <CommandGroup
                                        heading="Communities"
                                        key="communities"
                                    >
                                        {queryResults?.communities.map(
                                            (community: Community) => (
                                                <CommandItem
                                                    onSelect={(e) => {
                                                        router.push(`/c/${e}`);
                                                        setOpen(false);
                                                        router.refresh();
                                                    }}
                                                    key={community.id}
                                                    value={community.name}
                                                >
                                                    <UserAvatar
                                                        user={{
                                                            name: community.name!,
                                                            image: community.image!,
                                                        }}
                                                    />
                                                    <div className="ml-2 flex w-full items-center gap-2">
                                                        <p className="w-32 truncate font-semibold sm:w-52 md:w-64">
                                                            c/{community.name}
                                                        </p>
                                                    </div>
                                                </CommandItem>
                                            ),
                                        )}
                                    </CommandGroup>
                                )}
                            </>
                        )}
                    </CommandList>
                )}
            </CommandDialog>
        </>
    );
}
