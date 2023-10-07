import Link from "next/link";
import { getServerSession } from "next-auth";

// import { feedConfig } from "@/config/navigations";
import { linksConfig, siteConfig } from "@/config/site";
import { authOptions, getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

import { SignInButton } from "@/components/auth/sign-in-button";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { NavbarItems } from "@/components/layout/nav-bar-items";

type IconName = keyof typeof Icons;

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function NavBar({ className }: NavBarProps) {
    const session = await getAuthSession();

    return (
        <header
            className={cn(
                "bg-background sticky top-0 z-40 w-full border-b",
                className,
            )}
        >
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <Link
                    href={linksConfig.home.href}
                    className="flex items-center space-x-2"
                >
                    <Icons.logo className="h-6 w-6" />
                    <span className="inline-block font-bold">
                        {siteConfig.name}
                    </span>
                </Link>

                <div className="ml-auto flex items-center space-x-4">
                    <NavbarItems />

                    {session?.user ? (
                        <UserAccountNav user={session.user} />
                    ) : (
                        <SignInButton />
                    )}
                </div>
            </div>
        </header>
    );
}
