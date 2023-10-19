import { Bottombar } from "@/components/layout/bottom-bar";
import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import UserMessagesBar from "@/components/messages/messages-list-bar";

interface ConversationLayoutProps {
    children: React.ReactNode;
}

export default function ConversationLayout({
    children,
}: ConversationLayoutProps) {
    return (
        <>
            <UserMessagesBar className="bg-background hidden w-80 border-r md:block" />
            <section className="min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-28 max-md:pb-6 sm:px-10">
                <div className="h-full w-full max-w-4xl">{children}</div>
            </section>
        </>
    );
}
