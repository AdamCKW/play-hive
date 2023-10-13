import { IPost } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostQueryProps {
    queryKey: string[];
    query: string;
    initialData: IPost;
}

export const usePostQuery = ({
    queryKey,
    query,
    initialData,
}: PostQueryProps) =>
    useQuery(
        queryKey,
        async () => {
            const response = await axios.get(`${query}`);

            return response.data as IPost;
        },
        {
            initialData,
        },
    );
