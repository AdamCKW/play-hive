"use client";

import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "./modals-provider";

interface LayoutProps {
    children: ReactNode;
}

const Providers: FC<LayoutProps> = ({ children }) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
                <ModalProvider />
            </SessionProvider>
        </QueryClientProvider>
    );
};

export default Providers;
