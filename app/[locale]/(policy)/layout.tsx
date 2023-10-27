import { Icons } from "@/components/icons";
import { Bottombar } from "@/components/layout/bottom-bar";
import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";
import { linksConfig, siteConfig } from "@/config/site";
import Link from "next/link";

interface PolicyLayoutProps {
    children: React.ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
    return (
        <>
            <nav className="bg-background fixed top-0 z-30 w-full border-b py-3 shadow-sm sm:px-3 md:px-6">
                <div className="flex items-center justify-between space-x-4 px-3 sm:space-x-0 sm:px-5 md:px-6">
                    <Link
                        href={linksConfig.home.href}
                        className="mx-auto flex items-center space-x-2 "
                    >
                        <Icons.logo className="h-10 w-10" />
                        <span className="text-base font-bold md:inline-block md:text-xl">
                            {siteConfig.name}
                        </span>
                    </Link>
                </div>
            </nav>
            <main className="flex flex-row">
                <section className="flex min-h-screen w-full flex-1 flex-col items-center pb-10 pt-28 max-md:pb-32 sm:px-10">
                    <div className="w-full max-w-4xl">{children}</div>
                </section>
            </main>
        </>
    );
}
