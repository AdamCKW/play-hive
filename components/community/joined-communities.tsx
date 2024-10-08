import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { assign, map, pick } from "lodash";
import { Community, Prisma, User } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface JoinedCommunitiesCard extends React.HTMLAttributes<HTMLDivElement> {}

export async function JoinedCommunitiesCard({
    className,
}: JoinedCommunitiesCard) {
    const session = await getAuthSession();
    const subscriptions = await db.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            community: true,
        },
    });

    const communities = map(subscriptions, "community");

    if (!subscriptions) {
        return null;
    }

    return (
        <div className={cn("py-2", className)}>
            <ListOfUsers communities={communities} />
        </div>
    );
}

function ListOfUsers({ communities }: { communities: Community[] }) {
    const t = useTranslations("widgets.community_list");

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
                        {communities.map((community, i) => (
                            <Link
                                href={`/c/${community.name}`}
                                key={community.id}
                                className="flex max-h-10 items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <UserAvatar
                                        user={{
                                            name: community.name,
                                            image: community.image,
                                        }}
                                    />
                                    <div className="w-36 overflow-hidden">
                                        <p className="truncate text-sm font-medium leading-none">
                                            c/{community.name}
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
