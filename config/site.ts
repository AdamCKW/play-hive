import { create } from "zustand";
import { LinkConfig } from "@/types";

export type SiteConfig = typeof siteConfig;

export const LOCALES = ["en", "ms", "zh", "ja"];

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

export const themeOptions = [
    "light",
    "dark",
    "blue",
    "yellow",
    "neon-green",
    "purple",
    "system",
];

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
        disabled: false,
    },
    terms: {
        title: "terms",
        href: "/terms",
        disabled: true,
    },
    replies: {
        title: "replies",
        href: "/replies",
        disabled: false,
    },
    posts: {
        title: "posts",
        href: "/",
        disabled: false,
    },
    privacy: {
        title: "privacy",
        href: "/privacy",
        disabled: true,
    },
    discover: {
        title: "discover",
        href: "/discover",
        icon: "compass",
    },
    news: {
        title: "news",
        href: "/news",
        icon: "news",
    },
    communities: {
        title: "communities",
        href: "/c",
        icon: "users",
    },
    create: {
        title: "create",
        href: "/create",
    },
    messages: {
        title: "messages",
        href: "/messages",
        disabled: false,
        icon: "mail",
    },
    profile: {
        title: "profile",
        href: "/",
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
        title: "manage",
        href: "/dashboard/users",
        disabled: false,
        // icon: "manage",
    },
    cookie: {
        title: "cookie",
        href: "/cookie",
        disabled: true,
    },
    accessibility: {
        title: "accessibility",
        href: "/accessibility",
        disabled: true,
    },
    ads: {
        title: "ads",
        href: "/ads",
        disabled: true,
    },
    about: {
        title: "about",
        href: "/about",
        disabled: true,
    },
    following: {
        title: "following",
        href: "/following",
        disabled: false,
    },
};
