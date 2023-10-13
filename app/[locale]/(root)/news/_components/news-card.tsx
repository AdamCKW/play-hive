import { removeHtmlTags, rgbDataURL, splitDate } from "@/lib/utils";
import { ExtendedMetadata } from "@/types";
import { Article } from "@/types/article";
import { useTranslations } from "next-intl";
import { getTranslator } from "next-intl/server";
import Image from "next/image";

interface NewsCardProps {
    data: Article;
}

export async function generateMetadata({
    params: { locale },
}: ExtendedMetadata) {
    const t = await getTranslator(locale, "metadata.news");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function NewsCard({ data }: NewsCardProps) {
    const cleanData = removeHtmlTags(data.body);
    const dates = splitDate(data.publish_date);
    const t = useTranslations("root.news");

    return (
        <article className="flex border-b">
            <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
                <time
                    dateTime="2022-10-10"
                    className="light:text-gray-900 flex items-center justify-between gap-4 text-xs font-bold uppercase"
                >
                    <span>{dates.year}</span>
                    <span className="bg-muted-foreground w-px flex-1"></span>
                    <span>{dates.monthDay}</span>
                </time>
            </div>

            <div className="hidden sm:block sm:basis-56">
                <Image
                    alt={data.deck}
                    src={data.image.square_small}
                    width={500}
                    height={500}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={rgbDataURL(220, 220, 220)}
                    className="aspect-square h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={data.site_detail_url}
                    >
                        <h3 className="light:text-gray-900 font-bold uppercase">
                            {data.title}
                        </h3>
                    </a>
                    <p className="light:text-gray-700 mt-2 line-clamp-3 text-sm/relaxed">
                        {cleanData}
                    </p>
                </div>

                <div className="sm:flex sm:items-end sm:justify-end">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={data.site_detail_url}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 block px-5 py-3 text-center text-xs font-bold uppercase transition"
                    >
                        {t("read_news")}
                    </a>
                </div>
            </div>
        </article>
    );
}
