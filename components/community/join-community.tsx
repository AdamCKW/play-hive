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
import JoinCommunityToggle from "./join-community-toggle";

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

    if (!community) return notFound();

    return (
        <div className={cn("px-4 py-2", className)}>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>About /c/{community?.name}</CardTitle>
                    <CardDescription className="flex justify-between gap-x-4 py-3">
                        <span className="text-gray-500">Created At</span>
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
                            <dt>You created this community</dt>
                        </div>
                    ) : (
                        <div className="flex justify-between gap-x-4">
                            <dt className="">Created By</dt>
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
                ) : null}
            </Card>
        </div>
    );
}
