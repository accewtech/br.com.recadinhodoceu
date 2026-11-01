import type { CSSProperties, Ref } from "react";
import {
  renderMessageCardMarkup,
  type MessageColor,
  type MessageData,
} from "./message";

type MessageCardProps = {
  color: MessageColor;
  message: MessageData;
  previewRef?: Ref<HTMLDivElement>;
};

export function MessageCard({ color, message, previewRef }: MessageCardProps) {
  const style = {
    backgroundColor: color,
    "--message-highlight": color,
  } as CSSProperties & { "--message-highlight": string };

  return (
    <div
      className="preview-frame"
      dangerouslySetInnerHTML={{ __html: renderMessageCardMarkup(message) }}
      ref={previewRef}
      style={style}
    />
  );
}
