import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LeftItems } from "@/components/layout/left-items";

import { CreatePostButton } from "@/components/posts/create/button-client";
import { FooterItems } from "@/config/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useTranslations } from "next-intl";
import { User as NextAuthUser } from "next-auth";

interface LeftBarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface LeftbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
    user: NextAuthUser;
}

export async function LeftBar({ className }: LeftBarProps) {
    const session = await getAuthSession();

    return <LeftbarContent className={className} user={session?.user!} />;
}

function LeftbarContent({ className, user }: LeftbarContentProps) {
    const tNav = useTranslations("nav");

    return (
        <section
            className={cn(
                "sticky left-0 top-0 z-20 hidden h-screen flex-col justify-between border-r pb-5 pt-28 md:flex",
                className,
            )}
        >
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                <LeftItems />

                {user && <CreatePostButton user={user} />}

                <footer className="space-x-2 px-8">
                    {FooterItems.map((item, index) => (
                        <Link
                            key={`${item.title}-${index}`}
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
        </section>
    );
}
