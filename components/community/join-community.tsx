import Link from "next/link";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { ICommunity } from "@/types/db";
// import JoinCommunityToggle from "./join-community-toggle";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
// import { EditCommunityButton } from "./edit-community-button";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
const JoinCommunityToggle = dynamic(() => import("./join-community-toggle"), {
    loading: () => <Skeleton className="h-10 w-full" />,
});

const EditCommunityButton = dynamic(() => import("./edit-community-button"), {
    loading: () => <Skeleton className="h-10 w-full" />,
});

interface JoinCommunityCardProps extends React.HTMLAttributes<HTMLDivElement> {
    communityInfo: {
        community: ICommunity;
        isSubscribed: boolean;
        memberCount: number;
    };
}

export default async function JoinCommunityCard({
    className,
    communityInfo,
}: JoinCommunityCardProps) {
    const session = await getAuthSession();
    const { community, isSubscribed, memberCount } = communityInfo;

    if (!community) notFound();

    return (
        <div className={cn("px-4 py-2", className)}>
            <WidgetCard
                community={community}
                memberCount={memberCount}
                session={session!}
                isSubscribed={isSubscribed}
            />
        </div>
    );
}
function WidgetCard({
    community,
    memberCount,
    session,
    isSubscribed,
}: {
    community: ICommunity;
    memberCount: number;
    session: Session;
    isSubscribed: boolean;
}) {
    const t = useTranslations("communication.community.card");

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>
                    {t("title", { community_name: community?.name })}
                </CardTitle>
                <CardDescription className="flex justify-between gap-x-4 py-3">
                    <span className="text-gray-500">{t("created_at")}</span>
                    <span className="text-gray-700">
                        <time dateTime={community.createdAt.toDateString()}>
                            {format(community.createdAt, "MMMM d, yyyy")}
                        </time>
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex justify-between gap-x-4">
                    <dt className="">Members</dt>
                    <dd className="flex items-start gap-x-2">
                        <span>{memberCount}</span>
                    </dd>
                </div>
                {community.creatorId === session?.user?.id ? (
                    <div className="flex justify-between gap-x-4 ">
                        <dt>{t("creator")}</dt>
                    </div>
                ) : (
                    <div className="flex justify-between gap-x-4">
                        <dt className="">{t("created_by")}</dt>
                        <dd className="flex items-start gap-x-2">
                            <Link href={`/${community.creator?.username}`}>
                                @{community.creator?.username}
                            </Link>
                        </dd>
                    </div>
                )}
            </CardContent>

            {community.creatorId !== session?.user?.id ? (
                <CardFooter>
                    <JoinCommunityToggle
                        isSubscribed={isSubscribed}
                        communityId={community.id}
                        communityName={community.name}
                    />
                </CardFooter>
            ) : (
                <CardFooter>
                    <EditCommunityButton community={community} />
                </CardFooter>
            )}
        </Card>
    );
}
