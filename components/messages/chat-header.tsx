import { Hash } from "lucide-react";

import { IUser } from "@/types/db";
import { UserAvatar } from "../user-avatar";

interface ChatHeaderProps {
    user: IUser;
}

export const ChatHeader = ({ user }: ChatHeaderProps) => {
    return (
        <div className="text-md flex h-12 items-center border-b border-neutral-200 px-3 font-semibold dark:border-neutral-800">
            <div className="text-md flex h-12 items-center px-3 font-semibold dark:border-neutral-800">
                {/* <MobileToggle serverId={serverId} /> */}

                <UserAvatar
                    user={user}
                    className="mr-2 h-8 w-8 md:h-8 md:w-8"
                />

                <p className="text-md font-semibold text-black dark:text-white">
                    {user.name}
                </p>
            </div>
        </div>
    );
};
