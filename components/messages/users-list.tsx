"use client";

import { IUser } from "@/types/db";

interface UsersListProps {
    users?: IUser[];
}

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { UserAvatar } from "../user-avatar";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { linksConfig, siteConfig } from "@/config/site";

export default function UsersList({ users }: UsersListProps) {
    const router = useRouter();
    const t = useTranslations("communication.following");
    return (
        <Command className="max-h-[calc(100%-7rem)] md:max-h-[calc(100%-3.5rem)]">
            <CommandInput placeholder={t("label")} />
            <CommandList className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-none">
                <CommandEmpty>{t("no_results")}</CommandEmpty>
                <CommandGroup>
                    {users?.map((user) => (
                        <CommandItem
                            key={user.id}
                            onSelect={() => {
                                router.push(
                                    `${linksConfig.messages.href}/${user.username}`,
                                );
                            }}
                            className="aria-selected:bg-background"
                        >
                            <div className="relative flex w-full cursor-pointer select-none items-center space-x-3">
                                <div className="relative">
                                    <UserAvatar user={user} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col items-start focus:outline-none">
                                        <div className="flex w-full items-center justify-between">
                                            <p className="font-medium capitalize">
                                                {user.name}
                                            </p>
                                        </div>
                                        <div className="flex w-full items-center justify-start">
                                            <p className="text-muted-foreground truncate text-xs font-medium">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
