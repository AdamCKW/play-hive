import { Bottombar } from "@/components/layout/bottom-bar";
import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <NavBar />
            <main className="flex flex-row">
                <LeftBar className="w-[20rem]" />
                <section className="flex min-h-screen w-full flex-1 flex-col items-center pb-10 pt-28 max-md:pb-32 sm:px-10">
                    <div className="w-full max-w-4xl">{children}</div>
                </section>
                <RightBar className="w-[25rem]" main />
            </main>
            <Bottombar />
        </>
    );
}
