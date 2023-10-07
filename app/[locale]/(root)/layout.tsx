import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: RootLayoutProps) {
    return (
        <>
            <div className="flex h-screen">
                <div className="flex flex-1 flex-col overflow-hidden">
                    <NavBar />
                    <div className="flex h-full">
                        <LeftBar className="hidden w-[30rem] md:block" />

                        <main className="scrollbar-hide mb-14 flex w-full flex-col overflow-y-auto overflow-x-hidden">
                            <div className="mx-auto w-full max-w-[800px] pb-8 ">
                                {children}
                            </div>
                        </main>
                        <RightBar className="hidden w-[35rem]  xl:block" />
                    </div>
                </div>
            </div>
        </>
    );
}
