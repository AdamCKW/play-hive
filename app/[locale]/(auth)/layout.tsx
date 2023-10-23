import Image from "next/image";
import Link from "next/link";

import "next/navigation";

import { linksConfig, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const translate = useTranslations("auth.layout");

    return (
        <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
            <AspectRatio ratio={16 / 9}>
                <Image
                    src={translate("image_src")}
                    alt={translate("image_alt")}
                    fill
                    className="absolute inset-0 object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <Link
                    href={linksConfig.signIn.href}
                    className="absolute left-8 top-6 z-20 flex items-center text-lg font-bold tracking-tight text-white"
                >
                    <Icons.logo className="mr-2 h-6 w-6" aria-hidden="true" />
                    <span>{siteConfig.name}</span>
                </Link>

                <div className="absolute bottom-6 left-5 z-20 mt-auto hidden text-white sm:block">
                    <blockquote className="space-y-2 border-l-2 pl-6 italic">
                        <p className="text-lg">{translate("quote_text")}</p>
                        <footer className="text-sm">
                            {translate("quote_author")}
                        </footer>
                    </blockquote>
                </div>
            </AspectRatio>

            <main className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center px-0 sm:px-8 md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
                {children}
            </main>
        </div>
    );
}
