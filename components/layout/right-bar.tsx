import Link from "next/link";

import { siteConfig } from "@/config/site";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { ICommunity } from "@/types/db";
import dynamic from "next/dynamic";
import { UserSuggestionsCard } from "../widgets/user-suggestions-card";
import { JoinedCommunitiesCard } from "../community/joined-communities";
import { CommunitySuggestionsCard } from "../widgets/communities-suggestions-card";

const CreatePostButton = dynamic(
    () => import("@/components/community/create-button"),
);
const JoinCommunityCard = dynamic(
    () => import("@/components/community/join-community"),
);

const CreateCommunityCard = dynamic(
    () => import("@/components/community/create-community"),
);

interface RightBarProps extends React.HTMLAttributes<HTMLDivElement> {
    main?: boolean;
    feed?: boolean;
    individual?: boolean;
    communityInfo?: {
        community: ICommunity;
        isSubscribed: boolean;
        memberCount: number;
    };
}

export async function RightBar({
    className,
    main = false,
    feed = false,
    individual = false,
    communityInfo,
}: RightBarProps) {
    const session = await getAuthSession();

    return (
        <section
            className={cn(
                "sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l px-6 pb-6 pt-28 max-xl:hidden",
                className,
            )}
        >
            <div className="flex flex-1 flex-col justify-start">
                {feed && <CreateCommunityCard />}

                {individual && (
                    <>
                        {communityInfo?.isSubscribed && <CreatePostButton />}

                        <JoinCommunityCard communityInfo={communityInfo!} />
                    </>
                )}

                {feed || individual ? <JoinedCommunitiesCard /> : null}

                {feed && <CommunitySuggestionsCard />}

                {main && <UserSuggestionsCard />}
            </div>
        </section>
    );
}
