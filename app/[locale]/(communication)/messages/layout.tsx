import { Bottombar } from "@/components/layout/bottom-bar";
import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";
import UserMessagesBar from "@/components/messages/messages-list-bar";
import UserFollowingBar from "@/components/messages/user-list-bar";

interface MessagesLayoutProps {
    children: React.ReactNode;
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
    return (
        <>
            <NavBar />
            <main className="flex flex-row">
                <LeftBar className="w-[20rem]" />
                {children}
            </main>
            <Bottombar />
        </>
    );
}
