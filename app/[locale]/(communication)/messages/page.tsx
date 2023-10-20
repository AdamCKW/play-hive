import EmptyState from "@/components/messages/empty-state";
import UserMessagesBar from "@/components/messages/messages-list-bar";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.messages");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function MessagesPage() {
    return (
        <>
            <UserMessagesBar className={`bg-background border-r md:w-80`} />
            <section className="hidden min-h-screen flex-1 flex-col items-center justify-center pb-10 pt-28 max-md:pb-32 sm:px-10 lg:flex">
                <div className="hidden w-full max-w-4xl lg:block">
                    <div className="hidden h-full lg:block">
                        <EmptyState />
                    </div>
                </div>
            </section>
        </>
    );
}
