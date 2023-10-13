import Link from "next/link";

// import { feedConfig } from "@/config/navigations";
import { siteConfig } from "@/config/site";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
// import CreateCommunityCard from "@/components/widgets/create-community";
// import CreatePostCard from "@/components/widgets/create-community-post";
// import JoinCommunityCard from "../widgets/join-community";

import { RightBarItems } from "@/config/navigation";
import { getTranslator } from "next-intl/server";
import { useIntl } from "@/hooks/use-intl";
import { useTranslations } from "next-intl";
import CreateCommunityCard from "../community/create-community";
import { ICommunity } from "@/types/db";
import CreatePostCard from "../community/create-card";

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
                    <>{communityInfo?.isSubscribed && <CreatePostCard />}</>
                )}
            </div>
        </section>
    );
}
