import NewsSkeletonCard from "@/components/news/news-skeleton-card";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { ExtendedMetadata } from "@/types";
import axios from "axios";
import { getTranslator } from "next-intl/server";
import dynamic from "next/dynamic";
import queryString from "query-string";
// import NewsFeed from "@/components/news/news-feed";
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
    return (
        <>
            <div className="border-b pb-4">
                <div className="flex items-center space-x-4 px-6">
                    <h1 className="text-2xl font-bold">Gaming News</h1>
                </div>
            </div>
            <div className="2xl:mx-4">
                <NewsFeed initialData={news.data.results} />
            </div>
        </>
    );
}
