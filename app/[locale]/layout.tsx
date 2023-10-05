import { siteConfig } from "@/config/site";
import "./globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/lib/providers";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontHeading = localFont({
    src: "../assets/fonts/CalSans-SemiBold.woff2",
    variable: "--font-heading",
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Server Components",
        "Radix UI",
        "Social Network",
        "Gaming",
        "Gamer",
        "shadcn",
        "PlayHive",
    ],
    authors: [
        {
            name: "Adam Chong Karr Weng",
            url: siteConfig.links.github,
        },
    ],
    creator: "Adam Chong Karr Weng",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

const locales = ["en"];

interface RootLayoutProps {
    children: React.ReactNode;
    params: {
        locale: string;
    };
}

export default async function RootLayout({
    children,
    params: { locale },
}: RootLayoutProps) {
    const isValidLocale = locales.some((cur) => cur === locale);
    if (!isValidLocale) notFound();

    let messages;
    try {
        messages = (await import(`../../config/lang/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={cn(
                    "bg-background min-h-screen font-sans antialiased",
                    fontSans.variable,
                    fontHeading.variable,
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Providers>
                        <NextIntlClientProvider locale={locale}>
                            {children}
                        </NextIntlClientProvider>
                    </Providers>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
