import { useTranslations } from "next-intl";

export default function EmptyState() {
    const t = useTranslations("communication.state");

    return (
        <div className="flex h-full items-center justify-center px-4 py-10 sm:px-6">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-primary/90 text-xl font-semibold md:text-2xl">
                    {t("heading")}
                </h2>
                <p className="text-muted-foreground mt-4 max-w-lg text-center">
                    {t("subheading")}
                </p>
            </div>
        </div>
    );
}
