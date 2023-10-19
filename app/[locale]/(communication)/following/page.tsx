import EmptyState from "@/components/messages/empty-state";
import { ExtendedMetadata } from "@/types";
import { getTranslator } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.following");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function UsersPage() {
    return (
        <>
            <div className="hidden h-full lg:block">
                <EmptyState />
            </div>
        </>
    );
}
