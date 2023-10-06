import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
import locale from "date-fns/locale/en-US";
import { randomBytes } from "crypto";

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
    return formatDistanceToNowStrict(date, {
        addSuffix: true,
        locale: {
            ...locale,
            formatDistance,
        },
    });
}

export const generateRandomToken = (length: number = 32) =>
    randomBytes(length / 2).toString("hex");

export const transformObject = (obj: any) => {
    const { likes, _count, ...rest } = obj;

    const transformed = {
        ...rest,
        likedByUser: likes?.length > 0,
        likesCount: _count?.likes,
        childrenCount: _count?.children,
    };

    if (obj.children) {
        transformed.children = obj.children.map((child: any) =>
            transformObject(child),
        );
    }

    if (obj.parent) {
        transformed.parent = transformObject(obj.parent);
    }

    return transformed;
};

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
