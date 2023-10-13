import { RightBar } from "@/components/layout/right-bar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CommunitiesPage() {
    const session = await getAuthSession();

    return (
        <>
            <section className=" flex min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
                <div className="w-full max-w-4xl"></div>
            </section>
            <RightBar className="w-[25rem]" feed />
        </>
    );
}
