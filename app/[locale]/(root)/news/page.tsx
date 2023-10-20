import { PostLoading } from "@/components/loading";
import NewsFeed from "@/components/news/news-feed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { ExtendedMetadata } from "@/types";
import axios from "axios";
import { getTranslator } from "next-intl/server";
import dynamic from "next/dynamic";
import queryString from "query-string";

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.news");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function NewsPage() {
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

    const news = await axios.get(query);

    if (!news) return null;

    // console.log(news.data.results);
    return <NewsFeed initialData={news.data.results} />;
}
