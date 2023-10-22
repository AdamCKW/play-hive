"use client";

import { useRouter } from "next/navigation";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "../ui/button";
import { IAuthor } from "@/types/db";
import { UserAvatar } from "../user-avatar";

interface NameLinkProps {
    author: IAuthor;
}

export default function NameLink({ author }: NameLinkProps) {
    const router = useRouter();

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/${author.username}`);
                    }}
                >
                    <div className="flex max-w-[170px] flex-col">
                        <p className="truncate font-semibold hover:underline">
                            {author.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs hover:underline">
                            @{author.username}
                        </p>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between ">
                    <UserAvatar
                        user={{
                            name: author.name!,
                            image: author.image!,
                        }}
                    />
                    <div className="w-full space-y-1 px-2">
                        <div className="flex flex-col">
                            <p className="font-semibold hover:underline">
                                {author.name}
                            </p>
                            <p className="text-muted-foreground truncate text-xs font-light hover:underline">
                                @{author.username}
                            </p>
                        </div>

                        <p className="text-sm">{author.bio}</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
