import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";

interface CommunityLayoutProps {
    children: React.ReactNode;
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
    return (
        <>
            <NavBar />
            <main className="flex flex-row">
                <LeftBar className="w-[20rem]" />

                {children}
            </main>
        </>
    );
}
