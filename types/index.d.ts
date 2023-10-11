import type { Icon } from "lucide-react";

import { Icons } from "@/components/icons";

export type LinkConfig = {
    [key: string]: {
        title: string;
        href: string;
        disabled?: boolean;
        icon?: keyof typeof Icons;
    };
};

export type NavItem = {
    title: string;
    href: string;
    disabled?: boolean;
    icon?: keyof typeof Icons;
};

export type ExtendedMetadata = Metadata & { params: { locale: string } };

export type TFile = File & {
    preview: string;
};

// export type FeedConfig = {
//     navLinks: NavItem[];
//     userNav: NavItem[];
//     leftBar: NavItem[];
//     rightBar: NavItem[];
// };
