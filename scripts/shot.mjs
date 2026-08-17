#!/usr/bin/env node
/**
 * Screenshot a page at an arbitrary viewport width.
 *
 * The Linux Chrome bundled here is missing its shared libraries, so rendering
 * goes through the Windows Chrome over WSL interop. That Chrome refuses to open
 * a window narrower than 500px, which silently renders at 500 and crops the
 * image to whatever --window-size said: a mobile screenshot that looks broken
 * when the page is fine. Rendering inside a fixed-width iframe gives the page a
 * genuine layout viewport at any width.
 *
 *   node scripts/shot.mjs <url> <width> <height> <out.png>
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { basename } from "node:path";

const [url, width = "390", height = "2600", out = "shot.png"] = process.argv.slice(2);
if (!url) {
  console.error("usage: node scripts/shot.mjs <url> [width] [height] [out.png]");
  process.exit(1);
}

const CHROME = "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe";
const STAGE = "/mnt/c/Users/Developer/AppData/Local/Temp/fsws-build";
const WIN_STAGE = "C:\\Users\\Developer\\AppData\\Local\\Temp\\fsws-build";

mkdirSync(STAGE, { recursive: true });

const harness = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:#fff}
iframe{width:${width}px;height:${height}px;border:0;display:block}</style>
<iframe src="${url}" scrolling="no"></iframe>`;

const id = `harness-${width}`;
writeFileSync(`${STAGE}/${id}.html`, harness);

// window is padded past the iframe so Chrome's 500px floor never clips it
const winW = Math.max(Number(width) + 20, 520);

execFileSync(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    `--window-size=${winW},${height}`,
    "--virtual-time-budget=8000",
    `--screenshot=${WIN_STAGE}\\${id}.png`,
    `file:///${WIN_STAGE.replace(/\\/g, "/")}/${id}.html`,
  ],
  { stdio: "pipe" },
);

copyFileSync(`${STAGE}/${id}.png`, out);
console.log(`${basename(out)}  ${width}x${height}`);
