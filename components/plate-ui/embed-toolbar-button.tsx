import React from "react";
import {
    ELEMENT_IMAGE,
    ELEMENT_MEDIA_EMBED,
    useMediaToolbarButton,
} from "@udecode/plate-media";

import { Icons } from "@/components/icons";

import { ToolbarButton } from "./toolbar";

export function EmbedToolbarButton({
    nodeType,
}: {
    nodeType?: typeof ELEMENT_IMAGE | typeof ELEMENT_MEDIA_EMBED;
}) {
    const { props } = useMediaToolbarButton({ nodeType });

    return (
        <ToolbarButton {...props}>
            <Icons.embed />
        </ToolbarButton>
    );
}
