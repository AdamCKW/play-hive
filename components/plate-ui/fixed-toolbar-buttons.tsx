import React from "react";
import {
    MARK_BOLD,
    MARK_CODE,
    MARK_ITALIC,
    MARK_STRIKETHROUGH,
    MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { Value, useEditorReadOnly } from "@udecode/plate-common";
import { MARK_BG_COLOR, MARK_COLOR } from "@udecode/plate-font";
import { ListStyleType } from "@udecode/plate-indent-list";
import { ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from "@udecode/plate-media";

import { Icons, iconVariants } from "@/components/icons";
import { AlignDropdownMenu } from "@/components/plate-ui/align-dropdown-menu";
import { ColorDropdownMenu } from "@/components/plate-ui/color-dropdown-menu";
import { EmojiDropdownMenu } from "@/components/plate-ui/emoji-dropdown-menu";
import { IndentListToolbarButton } from "@/components/plate-ui/indent-list-toolbar-button";
import { IndentToolbarButton } from "@/components/plate-ui/indent-toolbar-button";
import { LineHeightDropdownMenu } from "@/components/plate-ui/line-height-dropdown-menu";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";
import { MediaToolbarButton } from "@/components/plate-ui/media-toolbar-button";
import { MoreDropdownMenu } from "@/components/plate-ui/more-dropdown-menu";
import { OutdentToolbarButton } from "@/components/plate-ui/outdent-toolbar-button";
import { TableDropdownMenu } from "@/components/plate-ui/table-dropdown-menu";

import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";
import { EmbedToolbarButton } from "./embed-toolbar-button";
import SubmitPlate from "../community/create/submit-plate";

interface FixedToolbarButtonsProps {
    output: {
        communityId: string;
        content: Value;
    };
}

export function FixedToolbarButtons({ output }: FixedToolbarButtonsProps) {
    const readOnly = useEditorReadOnly();

    return (
        <div className="w-full overflow-hidden">
            <div
                className="flex flex-wrap"
                style={{
                    transform: "translateX(calc(-1px))",
                }}
            >
                {!readOnly && (
                    <>
                        <ToolbarGroup noSeparator>
                            <InsertDropdownMenu />
                            <TurnIntoDropdownMenu />
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <MarkToolbarButton
                                tooltip="Bold (⌘+B)"
                                nodeType={MARK_BOLD}
                            >
                                <Icons.bold />
                            </MarkToolbarButton>
                            <MarkToolbarButton
                                tooltip="Italic (⌘+I)"
                                nodeType={MARK_ITALIC}
                            >
                                <Icons.italic />
                            </MarkToolbarButton>
                            <MarkToolbarButton
                                tooltip="Underline (⌘+U)"
                                nodeType={MARK_UNDERLINE}
                            >
                                <Icons.underline />
                            </MarkToolbarButton>

                            <MarkToolbarButton
                                tooltip="Strikethrough (⌘+⇧+M)"
                                nodeType={MARK_STRIKETHROUGH}
                            >
                                <Icons.strikethrough />
                            </MarkToolbarButton>
                            <MarkToolbarButton
                                tooltip="Code (⌘+E)"
                                nodeType={MARK_CODE}
                            >
                                <Icons.code />
                            </MarkToolbarButton>
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <ColorDropdownMenu
                                nodeType={MARK_COLOR}
                                tooltip="Text Color"
                            >
                                <Icons.color
                                    className={iconVariants({
                                        variant: "toolbar",
                                    })}
                                />
                            </ColorDropdownMenu>
                            <ColorDropdownMenu
                                nodeType={MARK_BG_COLOR}
                                tooltip="Highlight Color"
                            >
                                <Icons.bg
                                    className={iconVariants({
                                        variant: "toolbar",
                                    })}
                                />
                            </ColorDropdownMenu>
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <AlignDropdownMenu />

                            <LineHeightDropdownMenu />

                            <IndentListToolbarButton
                                nodeType={ListStyleType.Disc}
                            />
                            <IndentListToolbarButton
                                nodeType={ListStyleType.Decimal}
                            />

                            <OutdentToolbarButton />
                            <IndentToolbarButton />
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <LinkToolbarButton />

                            <MediaToolbarButton nodeType={ELEMENT_IMAGE} />

                            <EmbedToolbarButton
                                nodeType={ELEMENT_MEDIA_EMBED}
                            />

                            <TableDropdownMenu />

                            <EmojiDropdownMenu />

                            <MoreDropdownMenu />
                        </ToolbarGroup>
                    </>
                )}

                <div className="grow" />

                <ToolbarGroup noSeparator>
                    <SubmitPlate output={output} />
                </ToolbarGroup>
            </div>
        </div>
    );
}
