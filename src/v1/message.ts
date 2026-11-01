import type { MessageData } from "../shared/message-contract";

export {
  defaultMessage,
  getRandomMessageColor,
  MESSAGE_COLORS,
  type MessageColor,
  type MessageData,
} from "../shared/message-contract";

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

export function renderMessageCardMarkup(message: MessageData) {
  const gospel = escapeHtml(message.gospel.toUpperCase());
  const book = escapeHtml(message.book.replace(/^\(|\)$/g, ""));
  const messageOfDay = escapeHtml(message.messageOfDay);
  const account = escapeHtml(message.account);

  return `<div class="card-stack">
    <div class="backing-layer backing-layer-dark"></div>
    <div class="backing-layer backing-layer-light"></div>
    <article class="card">
      <header class="card-header">
        <h1 class="verse-title">${gospel}<span class="verse-reference">(${book})</span></h1>
      </header>
      <div class="reflection"><span class="highlight">${messageOfDay}</span></div>
      <footer class="footer">${account}</footer>
    </article>
  </div>`;
}
