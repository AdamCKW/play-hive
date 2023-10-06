import { LinkConfig } from "@/types";

export type SiteConfig = typeof siteConfig;

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
        title: "Home",
        href: "/",
        icon: "home",
    },
    signIn: {
        title: "Sign In",
        href: "/sign-in",
    },
    signUp: {
        title: "Sign Up",
        href: "/sign-up",
    },
    forgotPassword: {
        title: "Forgot Password",
        href: "/forgot-password",
        disabled: true,
    },
    terms: {
        title: "Terms",
        href: "/terms",
        disabled: true,
    },
    privacy: {
        title: "Privacy",
        href: "/privacy",
        disabled: true,
    },
    messages: {
        title: "Messages",
        href: "/messages",
        disabled: true,
        icon: "mail",
    },
};
