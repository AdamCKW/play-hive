import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface CommunityFeedLayoutProps {
    children: React.ReactNode;
}

export default async function CommunityFeedLayout({
    children,
}: CommunityFeedLayoutProps) {
    return (
        <>
            <section className="flex min-h-screen flex-1 flex-col items-center pb-10 pt-28 max-md:pb-32 sm:px-10">
                <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightBar className="w-[25rem]" feed />
        </>
    );
}
