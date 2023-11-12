import NewsSkeletonCard from "@/components/news/news-skeleton-card";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { ExtendedMetadata } from "@/types";
import axios from "axios";
import { getTranslator } from "next-intl/server";
import dynamic from "next/dynamic";
import queryString from "query-string";

const NewsFeed = dynamic(() => import("@/components/news/news-feed"), {
    ssr: false,
    loading: () => (
        <>
            {Array.from({ length: 10 }, (_, i) => (
                <NewsSkeletonCard key={i} />
            ))}
        </>
    ),
});

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.news");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function NewsPage({
    params,
}: {
    params: { locale: string };
}) {
    const t = await getTranslator(params.locale, "root.news");

    const query = queryString.stringifyUrl({
        url: "https://www.gamespot.com/api/articles/",
        query: {
            api_key: process.env.GAMESPOT_API_KEY,
            format: "json",
            sort: "publish_date:desc",
            filter: "categories:18",
            limit: INFINITE_SCROLL_PAGINATION_RESULTS,
        },
    });

    // const news = await axios.get(query);

    const news = await fetch(query, {
        next: { revalidate: 300 },
    }).then((res) => res.json());

    return (
        <>
            <div className="border-b pb-4">
                <div className="flex items-center space-x-4 px-6">
                    <h1 className="text-2xl font-bold">{t("heading")}</h1>
                </div>
            </div>
            {!news.results && (
                <div className="2xl:mx-4">
                    <NewsFeed initialData={news.results} />
                </div>
            )}
        </>
    );
}
