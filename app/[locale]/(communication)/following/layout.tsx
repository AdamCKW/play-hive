import { Bottombar } from "@/components/layout/bottom-bar";
import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";
import UserFollowingBar from "@/components/messages/user-list-bar";

interface FollowingLayoutProps {
    children: React.ReactNode;
}

export default function FollowingLayout({ children }: FollowingLayoutProps) {
    return (
        <>
            <NavBar />
            <main className="flex flex-row">
                <LeftBar className="w-[20rem]" />

                <UserFollowingBar className="bg-background w-full border-r md:w-80" />
                <section className="hidden min-h-screen flex-1 flex-col items-center justify-center px-6 pb-10 pt-28 max-md:pb-32 sm:px-10 md:flex">
                    <div className="w-full max-w-4xl">{children}</div>
                </section>
            </main>
            <Bottombar />
        </>
    );
}
