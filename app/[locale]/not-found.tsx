import { linksConfig } from "@/config/site";
import { useTranslations } from "next-intl";

import Image from "next/image";
import Link from "next/link";

interface NotFoundProps {}

export default function NotFound({}: NotFoundProps) {
    const t = useTranslations("not_found");

    return (
        <>
            <div className="flex w-screen justify-center">
                <div className="bg-background relative flex min-h-screen w-full max-w-[500px] flex-col items-center justify-center text-base">
                    <div className="flex w-full items-center justify-center py-5">
                        <div className="h-20 w-20 bg-cover">
                            <Image
                                src="/playhive.png"
                                width={300}
                                height={300}
                                alt="Threads logo"
                                className="min-h-full min-w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="mt-12 text-center font-semibold">
                        {t("heading")}
                    </div>
                    <div className="text-muted-foreground mt-4 text-center">
                        {t("subheading")}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href={linksConfig.home.href}
                            className="text-primary font-semibold underline-offset-4 hover:underline"
                        >
                            {t("redirect")}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
