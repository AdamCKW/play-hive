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
    copyright: "© 2023 PlayHive",
};
