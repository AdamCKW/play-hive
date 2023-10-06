// /** @type {import('next').NextConfig} */

// const withNextIntl = require("next-intl/plugin")("./i18n.ts");

// const nextConfig = withNextIntl({
//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "images.unsplash.com",
//                 port: "",
//             },
//             {
//                 protocol: "https",
//                 hostname: "*.googleusercontent.com",
//                 port: "",
//             },
//             {
//                 protocol: "https",
//                 hostname: "*.gamespot.com",
//                 port: "",
//             },
//             {
//                 protocol: "https",
//                 hostname: "uploadthing.com",
//                 port: "",
//             },
//             {
//                 protocol: "https",
//                 hostname: "picsum.photos",
//                 port: "",
//             },
//             {
//                 protocol: "https",
//                 hostname: "utfs.io",
//             },
//         ],
//     },
//     reactStrictMode: true,
// });

// module.exports = nextConfig;

const withNextIntl = require("next-intl/plugin")("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl({
    nextConfig,
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
});
