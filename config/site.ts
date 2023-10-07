import { LinkConfig } from "@/types";

export type SiteConfig = typeof siteConfig;

export const LOCALES = ["en"];

export const siteConfig = {
    name: "Play Hive",
    description:
        "A social network for gamers using beautifully designed components built with Radix UI and Tailwind CSS.",
    url: "/",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
    ],
    // ogImage: "/og.png",
    links: {
        twitter: "https://twitter.com/",
        github: "https://github.com/",
        docs: "",
    },
    copyright: "©2023 PlayHive",
};

export const linksConfig: LinkConfig = {
    home: {
        title: "home",
        href: "/",
        icon: "home",
    },
    signIn: {
        title: "sign_in",
        href: "/sign-in",
    },
    signUp: {
        title: "sign_up",
        href: "/sign-up",
    },
    forgotPassword: {
        title: "forgot_password",
        href: "/forgot-password",
        disabled: true,
    },
    terms: {
        title: "terms",
        href: "/terms",
        disabled: true,
    },
    privacy: {
        title: "privacy",
        href: "/privacy",
        disabled: true,
    },
    messages: {
        title: "messages",
        href: "/messages",
        disabled: true,
        icon: "mail",
    },
    profile: {
        title: "profile",
        href: "/p",
        disabled: false,
        icon: "user",
    },
    settings: {
        title: "settings",
        href: "/settings",
        disabled: false,
        icon: "settings",
    },
    reports: {
        title: "reports",
        href: "/dashboard/reports",
        disabled: false,
        // icon: "report",
    },
    manage: {
        title: "manage_user",
        href: "/dashboard/users",
        disabled: false,
        // icon: "manage",
    },
};
