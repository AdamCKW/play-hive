import { NavItem } from "@/types";
import { linksConfig } from "./site";

const {
    home,
    signIn,
    signUp,
    forgotPassword,
    terms,
    privacy,
    cookie,
    ads,
    accessibility,
    about,
    discover,
    news,
    communities,
    messages,
    profile,
} = linksConfig;

export const NavBarItems: NavItem[] = [
    {
        ...profile,
    },
];

export const LeftBarItems: NavItem[] = [
    { ...home },
    { ...discover },
    { ...news },
    { ...communities },
    { ...messages },
];

export const RightBarItems: NavItem[] = [
    { ...terms },
    { ...privacy },
    { ...cookie },
    { ...ads },
    { ...accessibility },
    { ...about },
];

export const BottomBarItems: NavItem[] = [
    { ...home },
    { ...discover },
    { ...news },
    { ...communities },
    { ...messages },
];

export const UserNavItems: NavItem[] = [];
