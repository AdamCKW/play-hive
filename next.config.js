/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")(
    // This is the default (also the `src` folder is supported out of the box)
    "./i18n.ts",
);

const nextConfig = withNextIntl({
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "*.gamespot.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "uploadthing.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
            },
            {
                protocol: "https",
                hostname: "utfs.io",
            },
        ],
    },
    reactStrictMode: true,
});

module.exports = nextConfig;
