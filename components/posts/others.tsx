import { Prisma } from "@prisma/client";

import { UserAvatar } from "../user-avatar";
import { IChildren } from "@/types/db";

interface OthersProps {
    others: IChildren[];
}
export default function Others({ others }: OthersProps) {
    if (others.length === 0) {
        return null;
    }

    if (others.length === 1) {
        return (
            <div className="text-muted-foreground relative mt-5 h-6 w-6 text-sm">
                <UserAvatar
                    className="absolute left-0 top-0 h-6 w-6 overflow-hidden text-xs"
                    user={{
                        name: others[0].author.name,
                        image: others[0].author.image,
                    }}
                />
            </div>
        );
    }

    if (others.length === 2) {
        return (
            <div className="text-muted-foreground relative mt-2 h-8 w-8 text-xs">
                <UserAvatar
                    className="absolute left-0 top-0 h-5 w-5 overflow-hidden"
                    user={{
                        name: others[0].author.name,
                        image: others[0].author.image,
                    }}
                />
                <UserAvatar
                    className="absolute bottom-0 right-0 h-4 w-4 overflow-hidden"
                    user={{
                        name: others[1].author.name,
                        image: others[1].author.image,
                    }}
                />
            </div>
        );
    }

    return (
        <div className="text-muted-foreground relative mt-2 h-8 w-8 text-xs">
            <UserAvatar
                className="absolute left-0 top-0 h-5 w-5 overflow-hidden"
                user={{
                    name: others[0].author.name,
                    image: others[0].author.image,
                }}
            />
            <UserAvatar
                className="absolute right-0 top-[15%] h-3.5 w-3.5 overflow-hidden text-[0.6rem]"
                user={{
                    name: others[1].author.name,
                    image: others[1].author.image,
                }}
            />
            <UserAvatar
                className="absolute bottom-0 left-[15%] h-3.5  w-3.5 overflow-hidden text-[0.6rem]"
                user={{
                    name: others[2].author.name,
                    image: others[2].author.image,
                }}
            />
        </div>
    );
}
