import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict, format } from "date-fns";
import { twMerge } from "tailwind-merge";
import locale from "date-fns/locale/en-US";
import { randomBytes } from "crypto";

import {
    RegExpMatcher,
    TextCensor,
    englishDataset,
    englishRecommendedTransformers,
    CensorContext,
    //@ts-ignore
} from "obscenity";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const formatDistanceLocale = {
    lessThanXSeconds: "just now",
    xSeconds: "just now",
    halfAMinute: "just now",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}}m",
    aboutXHours: "{{count}}h",
    xHours: "{{count}}h",
    xDays: "{{count}}d",
    aboutXWeeks: "{{count}}w",
    xWeeks: "{{count}}w",
    aboutXMonths: "{{count}}m",
    xMonths: "{{count}}m",
    aboutXYears: "{{count}}y",
    xYears: "{{count}}y",
    overXYears: "{{count}}y",
    almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
    options = options || {};

    const result = formatDistanceLocale[
        token as keyof typeof formatDistanceLocale
    ].replace("{{count}}", count.toString());

    if (options.addSuffix) {
        if (options.comparison > 0) {
            return "in " + result;
        } else {
            if (result === "just now") return result;

            return result + " ago";
        }
    }

    return result;
}

export function formatTimeToNow(date: Date): string {
    const differenceInDays = Math.floor(
        (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (differenceInDays > 3) {
        return format(date, "dd/MM/yyyy");
    } else {
        return formatDistanceToNowStrict(date, {
            addSuffix: true,
            locale: {
                ...locale,
                formatDistance,
            },
        });
    }
}

export const getInitials = (name: string) => {
    if (!name) return ""; // Return empty string if name is not provided
    const words = name.trim().split(" ");
    if (words.length === 1) {
        // Single-word name, return initials based on the first character
        return words[0].charAt(0).toUpperCase();
    } else {
        // Multi-word name, return initials based on the first character of each word
        return words.map((word) => word.charAt(0).toUpperCase()).join("");
    }
};

export const generateRandomToken = (length: number = 32) =>
    randomBytes(length / 2).toString("hex");

export const removeHtmlTags = (input: string) => {
    return input.replace(/<[^>]*>/g, "");
};

export const splitDate = (date: string) => {
    const dateObject = new Date(date);

    // Options for formatting the date
    const options = {
        year: "numeric" as const,
        month: "long" as const,
        day: "numeric" as const,
    };

    const formattedDate = dateObject.toLocaleDateString("en-US", options);

    const dateComponents = formattedDate.split(" ");

    const monthDay = dateComponents.slice(0, 2).join(" ").replace(",", "");

    const year = dateComponents[2];

    return { monthDay, year };
};

export const nFormatter = (num: number, digits: number) => {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
};

export const rgbDataURL = (r: number, g: number, b: number) => {
    const keyStr =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    const triplet = (e1: number, e2: number, e3: number) =>
        keyStr.charAt(e1 >> 2) +
        keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
        keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
        keyStr.charAt(e3 & 63);

    return `data:image/gif;base64,R0lGODlhAQABAPAA${
        triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
};

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});

export const cleanUp = (text: string) => {
    const asteriskStrategy = (ctx: CensorContext) =>
        "*".repeat(ctx.matchLength);

    const censor = new TextCensor().setStrategy(asteriskStrategy);
    const matches = matcher.getAllMatches(text);

    try {
        return censor.applyTo(text, matches);
    } catch {
        return text;
    }
};
