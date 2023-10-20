"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInterval } from "@mantine/hooks";
import { linksConfig } from "@/config/site";
import { Loader2 } from "lucide-react";
import { startTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const TimerRedirect = () => {
    const router = useRouter();
    const tVerification = useTranslations("verification");
    const [seconds, setSeconds] = useState(3);
    const interval = useInterval(() => setSeconds((s) => s - 1), 1000);

    useEffect(() => {
        interval.start();

        // Set a timeout to redirect after 3 seconds
        const timer = setTimeout(() => {
            router.replace(linksConfig.signIn.href);
            interval.stop();
        }, 3000); // 3000 milliseconds = 3 seconds

        // Clear the timeout when the component unmounts
        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tVerification("success.title", { count: seconds })}
        </div>
    );
};

export default TimerRedirect;
