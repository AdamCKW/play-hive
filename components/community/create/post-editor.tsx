"use client";

import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { plugins } from "@/lib/plate/plate-plugins";
import { cn } from "@/lib/utils";
import { Plate, Value } from "@udecode/plate-common";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDebouncedState } from "@mantine/hooks";

interface EditorProps {
    communityId: string;
}

export function PostEditor({ communityId }: EditorProps) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<Value>([]);
    const containerRef = useRef(null);

    return (
        <DndProvider backend={HTML5Backend}>
            <Plate
                plugins={plugins}
                onChange={(newValue) => {
                    setCurrentValue(newValue);
                }}
            >
                <div
                    ref={containerRef}
                    className={cn(
                        "[&_.slate-start-area-left]:!w-16 [&_.slate-start-area-right]:!w-16 [&_.slate-start-area-top]:!h-4",
                    )}
                >
                    <FixedToolbar>
                        <FixedToolbarButtons
                            output={{
                                communityId,
                                content: currentValue,
                            }}
                        />
                    </FixedToolbar>

                    <Editor
                        className="max-h-[600px] px-[96px] py-16"
                        autoFocus
                        focusRing={false}
                        variant="ghost"
                        size="md"
                    />

                    <FloatingToolbar>
                        <FloatingToolbarButtons />
                    </FloatingToolbar>

                    <CursorOverlay containerRef={containerRef} />
                </div>
            </Plate>
        </DndProvider>
    );
}
