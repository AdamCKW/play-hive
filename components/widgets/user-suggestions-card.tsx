import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { assign, map, pick } from "lodash";
import { Prisma, User } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface SuggestionsCardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The function `getUsersListInclude` returns a query object that includes a list of users followed
 * by a given set of IDs and the count of users following each user.
 * @param {string[]} myFollowingIds - An array of string values representing the IDs of the users
 * that you are following.
 */
const getUsersListInclude = (myFollowingIds: string[]) => ({
    followedBy: {
        where: {
            id: {
                in: myFollowingIds,
            },
        },
        select: {
            id: true,
            name: true,
        },
    },
    _count: {
        select: {
            followedBy: true,
        },
    },
});

const usersList = Prisma.validator<Prisma.UserArgs>()({
    include: getUsersListInclude([]),
});

type UsersListType = Prisma.UserGetPayload<typeof usersList>;

/**
 * The function `populateUsersList` takes in an array of user objects, along with an array of IDs
 * representing the users that the current user is following, and returns a new array of modified
 * user objects with additional properties.
 * @param {UsersListType[]} users - An array of objects representing user data. Each object should
 * have properties such as `_count`, `cover`, `emailVerified`, `followedBy`, and `id`.
 * @param {string[]} myFollowingIds - An array of string values representing the IDs of the users
 * that the current user is following.
 */
const populateUsersList = (users: UsersListType[], myFollowingIds: string[]) =>
    users.map(
        ({
            _count,
            cover,
            emailVerified,
            followedBy,
            id,
            ...suggestedUserData
        }) => ({
            ...suggestedUserData,
            id,
            mutualUsers: followedBy,
            followersCount: _count.followedBy,
            followedByMe: myFollowingIds.some((follow) => follow === id),
        }),
    );

interface SuggestedUsers extends Partial<User> {
    mutualUsers: Pick<User, "id" | "name">[];
    followersCount: number;
    followedByMe: boolean;
}

export async function UserSuggestionsCard({ className }: SuggestionsCardProps) {
    const session = await getAuthSession();

    /* The code is querying the database to find all the users that are being followed by the current
    user. */
    const myFollowing = await db.user.findMany({
        where: {
            followedBy: {
                some: {
                    id: session?.user.id,
                },
            },
        },
    });

    const myFollowingIds = map(myFollowing, "id");

    /* The code is querying the database to find users who are being followed by the users that the
    current user is following. */
    const suggestedUsers = await db.user.findMany({
        where: {
            followedBy: {
                some: {
                    id: {
                        in: myFollowingIds,
                    },
                },
            },
            id: {
                notIn: [...myFollowingIds, session?.user.id!],
            },
        },
        include: getUsersListInclude(myFollowingIds),
    });

    const suggestedUsersIds = map(suggestedUsers, "id");

    /* The code is querying the database to find popular users. */
    const popularUsers = await db.user.findMany({
        where: {
            id: {
                notIn: [
                    ...myFollowingIds,
                    ...suggestedUsersIds,
                    session?.user.id!,
                ],
            },
        },
        include: {
            followedBy: true,
            _count: {
                select: {
                    followedBy: true,
                },
            },
        },
        orderBy: {
            followedBy: {
                _count: "desc",
            },
        },
        take: 10,
    });

    const populatedPopularUsers = populateUsersList(
        popularUsers,
        myFollowingIds,
    );

    const populatedSuggestedUsers = populateUsersList(
        suggestedUsers,
        myFollowingIds,
    );

    const users = [...populatedSuggestedUsers, ...populatedPopularUsers].slice(
        0,
        10,
    );

    return (
        <div className={cn("py-2", className)}>
            <ListOfUsers users={users} />
        </div>
    );
}

function ListOfUsers({ users }: { users: SuggestedUsers[] }) {
    const t = useTranslations("widgets.user_suggestions");

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-muted-foreground text-sm">
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <div className="max-w-80 grid max-h-44 gap-6">
                        {users.map((user, i) => (
                            <Link
                                href={`/${user.username}`}
                                key={user.id}
                                className="flex max-h-10 items-center justify-between space-x-4"
                            >
                                <div className="flex items-center space-x-4">
                                    <UserAvatar user={user} />
                                    <div className="w-36 overflow-hidden">
                                        <p className="truncate text-sm font-medium leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-muted-foreground truncate text-sm">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
