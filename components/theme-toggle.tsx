"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CircleIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    const tTheme = useTranslations("theme");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 border-none px-0 outline-none ring-0"
                >
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <CircleIcon
                        className={`${
                            theme === "light" ||
                            theme === "dark" ||
                            theme === "system" ||
                            theme === undefined
                                ? "scale-0"
                                : "fill-primary stroke-primary"
                        } absolute h-[1.2rem] w-[1.2rem] transition-all`}
                    />

                    <span className="sr-only">{tTheme("toggle")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {tTheme("light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {tTheme("dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("blue")}>
                    {tTheme("blue")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("yellow")}>
                    {tTheme("yellow")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("neon-green")}>
                    {tTheme("green")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("purple")}>
                    {tTheme("purple")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {tTheme("system")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
