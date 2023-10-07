import Link from "next/link";

import { linksConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";

export function SignInButton() {
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
            Sign In
        </Link>
    );
}
