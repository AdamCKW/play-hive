import Link from "next/link";

// import { feedConfig } from "@/config/navigations";
import { siteConfig } from "@/config/site";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
// import CreateCommunityCard from "@/components/widgets/create-community";
// import CreatePostCard from "@/components/widgets/create-community-post";
// import JoinCommunityCard from "../widgets/join-community";
import { ICommunity } from "@/types/db";
import { RightBarItems } from "@/config/navigation";
import { getTranslator } from "next-intl/server";
import { useIntl } from "@/hooks/use-intl";
import { useTranslations } from "next-intl";

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

interface ItemsProps extends React.HTMLAttributes<HTMLDivElement> {
    main?: boolean;
    feed?: boolean;
    individual?: boolean;
    communityInfo?: {
        community: ICommunity;
        isSubscribed: boolean;
        memberCount: number;
    };
}

export async function RightBar(props: RightBarProps) {
    const session = await getAuthSession();

    return <Items {...props} />;
}

function Items({
    className,
    main = false,
    feed = false,
    individual = false,
    communityInfo,
    ...props
}: ItemsProps) {
    const tNav = useTranslations("nav");
    return (
        <div className={cn("pb-12", className)} {...props}>
            <div className="space-y-4 py-4">
                <footer key="rightbar-footer" className="space-x-2 px-8">
                    {RightBarItems.map((item, i) => (
                        <Link
                            className={cn(
                                item.disabled && "cursor-not-allowed",
                                "text-muted-foreground text-sm hover:text-current hover:underline",
                            )}
                            href={item.disabled ? "#" : item.href}
                        >
                            {tNav(item.title)}
                        </Link>
                    ))}
                    <span className="text-muted-foreground text-sm">
                        {siteConfig.copyright}
                    </span>
                </footer>
            </div>
        </div>
    );
}
