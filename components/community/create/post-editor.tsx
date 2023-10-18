"use client";

import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { plugins } from "@/lib/plate/plate-plugins";
import { cn } from "@/lib/utils";
import { Plate } from "@udecode/plate-common";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function PostEditor() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Plate plugins={plugins}>
                <FixedToolbar>
                    <FixedToolbarButtons />
                </FixedToolbar>

                <Editor />

                <FloatingToolbar>
                    <FloatingToolbarButtons />
                </FloatingToolbar>
            </Plate>
        </DndProvider>
    );
}
