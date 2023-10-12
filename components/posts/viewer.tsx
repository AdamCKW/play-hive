"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plate } from "@udecode/plate-common";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { plugins } from "@/lib/plate/plate-plugins";
import { cn } from "@/lib/utils";
import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { useDebouncedState } from "@mantine/hooks";
import { Button } from "../ui/button";
import { Editor } from "../plate-ui/editor";

interface EditorProps {
    content: any;
}

export default function Viewer({ content }: EditorProps) {
    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Plate plugins={plugins} readOnly initialValue={content}>
                    <Editor className="border-none" />
                </Plate>
            </DndProvider>
        </>
    );
}
