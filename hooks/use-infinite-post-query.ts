import { IPost, IReplies } from "@/types/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import queryString from "query-string";

interface InfiniteQueryProps {
    queryKey: string[];
    apiUrl: string;
    initialData: {
        pages: (IPost[] | IReplies[])[];
        pageParams: [number];
    };
    setNoMore: (value: boolean) => void;
}

export const useInfinitePostQuery = ({
    queryKey,
    apiUrl,
    initialData,
    setNoMore,
}: InfiniteQueryProps) => {
    return useInfiniteQuery(
        queryKey,
        async ({ pageParam = 1 }) => {
            const url = queryString.stringifyUrl({
                url: apiUrl,
                query: {
                    limit: 10,
                    page: pageParam,
                },
            });

            const response = await axios.get(url);

            if (response.data.length === 0) {
                setNoMore(true);
            } else {
                setNoMore(false);
            }

            return response.data;
        },
        {
            getNextPageParam: (_, pages) => {
                return pages.length + 1;
            },
            initialData,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
        },
    );
};
