import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import axios from "axios";
import NewsFeed from "./_components/news-feed";

export default async function NewsPage() {
    const news = await axios.get(
        `https://www.gamespot.com/api/articles/?api_key=${process.env.GAMESPOT_API_KEY}&format=json&sort=publish_date:desc&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&filter=categories:18`,
    );

    if (!news) return null;

    // console.log(news.data.results);
    return <NewsFeed initialData={news.data.results} />;
}
