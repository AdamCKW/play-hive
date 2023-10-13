import Link from "next/link";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { transformObject } from "@/lib/utils";

import { IPost } from "@/types/db";

interface CommunityPageProps {
    params: {
        name: string;
    };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const { name } = params;
    const session = await getAuthSession();

    return (
        <>
            <h1 className="text-3xl font-bold md:text-4xl">c/{name}</h1>
        </>
    );
}
