import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import queryString from "query-string";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);

        const { limit, page } = z
            .object({
                limit: z.string(),
                page: z.string(),
            })
            .parse({
                limit: url.searchParams.get("limit"),
                page: url.searchParams.get("page"),
            });

        const query = queryString.stringifyUrl({
            url: "https://www.gamespot.com/api/articles/",
            query: {
                api_key: process.env.GAMESPOT_API_KEY,
                format: "json",
                sort: "publish_date:desc",
                filter: "categories:18",
                limit: limit,
                page: page,
            },
        });

        const { data } = await axios(query);

        return NextResponse.json(data.results);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 400 });
        }

        return new NextResponse("500.internal_error", { status: 500 });
    }
}
