import type { Icon } from "lucide-react";

import { Icons } from "@/components/icons";

export type LinkConfig = {
    [key: string]: {
        title: string;
        href: string;
        disabled?: boolean;
        icon?: string;
    };
};

// export type FeedConfig = {
//     navLinks: NavItem[];
//     userNav: NavItem[];
//     leftBar: NavItem[];
//     rightBar: NavItem[];
// };
