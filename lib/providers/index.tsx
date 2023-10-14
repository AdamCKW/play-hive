"use client";

import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "./modals-provider";
import NextTopLoader from "nextjs-toploader";

interface LayoutProps {
    children: ReactNode;
}

const Providers: FC<LayoutProps> = ({ children }) => {
    const queryClient = new QueryClient();

    return (
        <>
            <NextTopLoader color="#FF0000" showSpinner={false} />
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    {children}
                    <ModalProvider />
                </SessionProvider>
            </QueryClientProvider>
        </>
    );
};

export default Providers;
