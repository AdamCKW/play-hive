"use client";

import { useIntl } from "@/hooks/use-intl";
import { useTranslations } from "next-intl";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { LOCALES } from "@/config/site";

export function LocaleSwitch() {
    const tIntl = useTranslations("intl");
    const { router, pathname, locale } = useIntl();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 border-none px-0 outline-none ring-0"
                >
                    {locale}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {LOCALES.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => router.replace(pathname, { locale })}
                    >
                        {tIntl(`${locale}.title`)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
