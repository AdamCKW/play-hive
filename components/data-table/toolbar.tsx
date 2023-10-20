"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./view-options";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const t = useTranslations("data_table.toolbar");
    const isFiltered = table.getState().columnFilters.length > 0;

    const [input, setInput] = useState("");

    //eslint-disable-next-line
    const request = useCallback(
        debounce((value) => {
            table.getColumn("username")?.setFilterValue(value);
        }, 500),
        [table],
    );

    useEffect(() => {
        request(input);
    }, [input, request]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter username..."
                    onChange={(event) => {
                        setInput(event.target.value);
                    }}
                    value={input}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        {t("reset")}
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
