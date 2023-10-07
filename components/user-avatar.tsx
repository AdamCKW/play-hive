import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";

import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "name" | "image">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <AvatarImage src={user.image} alt={`${user.name}'s Avatar`} />
            ) : (
                <AvatarFallback className="bg-indigo-500 font-medium text-white">
                    {getInitials(user.name!)}
                </AvatarFallback>
            )}
        </Avatar>
    );
}
