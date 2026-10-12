import "server-only";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  renderMessageCardMarkup,
  type MessageColor,
  type MessageData,
} from "./message";

const PREVIEW_WIDTH = 560;
const PREVIEW_HEIGHT = 700;
const OUTPUT_SCALE = 1.6;

async function getBrowserExecutablePath() {
  const configuredPath = process.env.CHROME_EXECUTABLE_PATH;
  if (configuredPath) {
    if (!existsSync(configuredPath)) {
      throw new Error(
        "CHROME_EXECUTABLE_PATH does not point to an existing file.",
      );
    }
    return configuredPath;
  }

  if (process.platform === "win32") {
    const installationRoots = [
      process.env.ProgramFiles,
      process.env["ProgramFiles(x86)"],
      process.env.LOCALAPPDATA,
    ].filter((path): path is string => Boolean(path));
    const localChromePath = installationRoots
      .map((root) =>
        join(root, "Google", "Chrome", "Application", "chrome.exe"),
      )
      .find(existsSync);

    if (!localChromePath) {
      throw new Error(
        "Install Google Chrome or set CHROME_EXECUTABLE_PATH to render images on Windows.",
      );
    }
    return localChromePath;
  }

  return chromium.executablePath();
}

export async function renderMessageWebp(
  data: MessageData,
  color: MessageColor,
) {
  const stylesheet = await readFile(
    join(process.cwd(), "app", "message-card.css"),
    "utf8",
  );
  const browser = await puppeteer.launch({
    args: process.platform === "win32" ? [] : chromium.args,
    defaultViewport: {
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
      deviceScaleFactor: OUTPUT_SCALE,
    },
    executablePath: await getBrowserExecutablePath(),
    headless: "shell",
  });

  try {
    const page = await browser.newPage();
    const markup = renderMessageCardMarkup(data);
    const html = `<!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Rakkas&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
          <style>
            ${stylesheet}
          </style>
          <style>
            * { box-sizing: border-box; }
            html, body { width: ${PREVIEW_WIDTH}px; height: ${PREVIEW_HEIGHT}px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="preview-frame" style="background-color: ${color}; --message-highlight: ${color};">${markup}</div>
        </body>
      </html>`;

    await page.setContent(html, { waitUntil: "load", timeout: 15000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    return await page.screenshot({ type: "webp", quality: 100 });
  } finally {
    await browser.close();
  }
}
