"use client";

import { formatTimeToNow } from "@/lib/utils";

export default function Timestamp({ time }: { time: Date }) {
    return (
        <div className="text-muted-foreground">
            {formatTimeToNow(new Date(time))}
        </div>
    );
}
