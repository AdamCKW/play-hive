import { TooltipProvider } from "@/components/plate-ui/tooltip";

interface CommunityCreateLayoutProps {
    children: React.ReactNode;
}

export default function CommunityCreateLayout({
    children,
}: CommunityCreateLayoutProps) {
    return (
        <TooltipProvider
            disableHoverableContent
            delayDuration={500}
            skipDelayDuration={0}
        >
            {children}
        </TooltipProvider>
    );
}
