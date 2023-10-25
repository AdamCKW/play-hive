"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plate, Value } from "@udecode/plate-common";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { plugins } from "@/lib/plate/plate-plugins";
import { Editor } from "../plate-ui/editor";

interface EditorProps {
    content: any;
}

export default function Viewer({ content }: EditorProps) {
    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Plate plugins={plugins} readOnly initialValue={content}>
                    <Editor className="overflow-x-hidden border-none" />
                </Plate>
            </DndProvider>
        </>
    );
}
