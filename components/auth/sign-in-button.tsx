import Link from "next/link";

import { linksConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";
import { useTranslations } from "next-intl";

export function SignInButton() {
    const tNav = useTranslations("nav");

    return (
        <Link
            href={linksConfig.signIn.href}
            className={cn(
                buttonVariants({
                    variant: "ghost",
                    size: "sm",
                }),
            )}
        >
            {tNav("signIn")}
        </Link>
    );
}
