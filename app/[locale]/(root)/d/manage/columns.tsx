"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Router } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/headers";
import { UserRole } from "@prisma/client";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { QueryClient } from "@tanstack/react-query";
import ManageActions from "@/components/data-table/manage-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    role: UserRole;
};

export const columns: ColumnDef<Users>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-full max-w-[100px] items-center">
                    <span className="truncate">{row.getValue("name")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(value));
        },
    },
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-full max-w-[100px] items-center ">
                    <span className="truncate">{row.getValue("username")}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-full max-w-[500px] truncate">
                    <span className="turncate">{row.getValue("email")}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const role: string = row.getValue("role");
            return (
                <div className="flex w-full max-w-[75px] items-center ">
                    <Badge
                        variant={
                            role === "ADMIN"
                                ? "default"
                                : role === "MODERATOR"
                                ? "secondary"
                                : role === "USER"
                                ? "outline"
                                : role === "BANNED"
                                ? "destructive"
                                : "default"
                        }
                    >
                        {role.charAt(0).toUpperCase() +
                            role.slice(1).toLowerCase()}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return <ManageActions user={user} />;
        },
    },
];
