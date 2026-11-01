import type { CSSProperties, Ref } from "react";
import {
  renderMessageCardMarkupV2,
  type MessageColor,
  type MessageData,
} from "./message-v2";

type MessageCardV2Props = {
  color: MessageColor;
  message: MessageData;
  previewRef?: Ref<HTMLDivElement>;
};

export function MessageCardV2({
  color,
  message,
  previewRef,
}: MessageCardV2Props) {
  const style = {
    backgroundColor: color,
    "--message-highlight": color,
  } as CSSProperties & { "--message-highlight": string };

  return (
    <div
      className="preview-frame"
      dangerouslySetInnerHTML={{ __html: renderMessageCardMarkupV2(message) }}
      ref={previewRef}
      style={style}
    />
  );
}
