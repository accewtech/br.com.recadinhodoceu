import MarkdownIt, { type Token } from "markdown-it";
import type { MessageData } from "../shared/message-contract";

export {
  defaultMessage,
  getRandomMessageColor,
  MESSAGE_COLORS,
  type MessageColor,
  type MessageData,
} from "../shared/message-contract";

const markdown = new MarkdownIt({
  breaks: true,
  html: true,
});

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

markdown.renderer.rules.html_inline = (tokens: Token[], index: number) => {
  const content = tokens[index].content;

  if (content.toLowerCase() === "<mark>") {
    return '<mark class="highlight">';
  }
  if (content.toLowerCase() === "</mark>") {
    return "</mark>";
  }

  return escapeHtml(content);
};

markdown.renderer.rules.html_block = (tokens: Token[], index: number) =>
  escapeHtml(tokens[index].content);

markdown.renderer.rules.image = (tokens: Token[], index: number) =>
  escapeHtml(tokens[index].content);

export function renderMessageCardMarkup(message: MessageData) {
  const gospel = escapeHtml(message.gospel.toUpperCase());
  const book = escapeHtml(message.book);
  const messageOfDay = markdown.render(message.messageOfDay);
  const account = escapeHtml(message.account);

  return `<div class="card-stack">
    <div class="backing-layer backing-layer-dark"></div>
    <div class="backing-layer backing-layer-light"></div>
    <article class="card">
      <header class="card-header">
        <h1 class="verse-title">${gospel}<span class="verse-reference">${book}</span></h1>
      </header>
      <div class="reflection">${messageOfDay}</div>
      <footer class="footer">${account}</footer>
    </article>
  </div>`;
}
