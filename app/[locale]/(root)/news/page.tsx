import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import axios from "axios";
import NewsFeed from "./_components/news-feed";
import queryString from "query-string";

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
