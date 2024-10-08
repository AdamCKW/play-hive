import Link from "next/link";
import { getServerSession } from "next-auth";

// import { feedConfig } from "@/config/navigations";
import { linksConfig, siteConfig } from "@/config/site";
import { authOptions, getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

import { UserAccountNav } from "@/components/layout/user-account-nav";
import { NavbarItems } from "@/components/layout/nav-bar-items";

type IconName = keyof typeof Icons;

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function NavBar({ className }: NavBarProps) {
    const session = await getAuthSession();

    return (
        <nav
            className={cn(
                "bg-background fixed top-0 z-30 w-full border-b py-3 shadow-sm sm:px-3 md:px-6",
                className,
            )}
        >
            <div className="flex items-center justify-between space-x-4 px-3 sm:space-x-0 sm:px-5 md:px-6">
                <Link
                    href={linksConfig.home.href}
                    className="flex items-center space-x-2"
                >
                    <Icons.logo className="h-10 w-10" />
                    <span className="hidden text-base font-bold md:inline-block md:text-xl">
                        {siteConfig.name}
                    </span>
                </Link>

                <div className="ml-auto flex items-center space-x-4">
                    <NavbarItems user={session?.user!} />

                    {session?.user ? (
                        <UserAccountNav user={session.user} />
                    ) : null}
                </div>
            </div>
        </nav>
    );
}
