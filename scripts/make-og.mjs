#!/usr/bin/env node
/**
 * Build the social preview images.
 *
 *   npm run og
 *
 * These are what Discord, WhatsApp, Slack, LinkedIn, iMessage and X show when
 * someone pastes a link. Until now there were none, so every share rendered as
 * a bare line of text.
 *
 * The composition is the hero, densified. The live hero can afford to be one
 * headline in a lot of air because you arrive at it and stay. A preview card is
 * 1200x630 seen at thumbnail size for about a second, so it has to say what the
 * company is and prove it in the same glance: mark and wordmark, eyebrow,
 * headline, and the registration strip pulled up into the frame. That strip is
 * the whole argument of the site, and it is the one thing a competitor's card
 * will not have.
 *
 * WHY THIS IS A SCRIPT AND NOT next/og
 *
 * ImageResponse renders through Satori, which implements a subset of CSS and
 * cannot do the things this composition rests on: a background photograph
 * cropped and colour-matched to the site, real tracking on the display face,
 * and the exact overlay the hero uses. Rendering the real thing in a real
 * browser and committing the result gives a card that matches the site because
 * it IS the site's CSS, costs nothing at runtime, and cannot fail on a cold
 * build. The trade is that it does not regenerate itself: change a page title
 * and you must run this again.
 *
 * It needs a Chrome and a network connection for the fonts, so it runs on a
 * workstation, not in CI. Everything it writes is committed.
 *
 * Output goes to Next's file convention paths, so the framework emits
 * og:image and twitter:image with the right dimensions and an absolute URL,
 * and every route gets the card for the page actually being shared rather than
 * the homepage's.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, "src/app");

const WIDTH = 1200;
const HEIGHT = 630;

/** Matches OVERLAY_ALPHA in components/sections/hero-video.tsx. Measured
 *  against the footage there; reused here so the card and the page agree. */
const OVERLAY = 0.76;

const CHROME =
  process.env.CHROME ?? "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe";
/** Chrome runs on the Windows side under WSL, so it needs a path it can see. */
const STAGE = "/mnt/c/Users/Developer/AppData/Local/Temp/fsws-og";
const WIN_STAGE = "C:\\Users\\Developer\\AppData\\Local\\Temp\\fsws-og";

/**
 * One card per route. Eyebrow and title track the page's own opener, so the
 * card and the page it links to say the same thing.
 *
 * `dir` is relative to src/app, and "" is the site root.
 */
const CARDS = [
  {
    dir: "",
    eyebrow: "Consented and auditable",
    title: "Waste management that survives an audit.",
  },
  {
    dir: "materials",
    eyebrow: "Materials",
    title: "Eight streams, and a named destination for each",
  },
  {
    // Every stream page shares this one. Next does not inherit a parent's
    // image, so without a file here the slug routes would fall back to the
    // root card.
    dir: "materials/[slug]",
    eyebrow: "Materials",
    title: "Where each stream goes, and who certifies it",
  },
  {
    dir: "services",
    eyebrow: "Services",
    title: "What we take on, and what you get back",
  },
  {
    dir: "products",
    eyebrow: "Products",
    title: "What the material becomes",
  },
  {
    dir: "credentials",
    eyebrow: "Credentials",
    title: "What we are licensed to do, and what we are not",
  },
  {
    dir: "about",
    eyebrow: "About",
    title: "A processing site, not a transfer station",
  },
  {
    dir: "contact",
    eyebrow: "Contact",
    title: "Tell us the site, the streams and the volumes",
  },
];

/** The strip along the bottom. Kept short enough to stay on one line. */
const FACTS = [
  ["CIN", "U37100UR2019PTC010043"],
  ["GSTIN", "05AADCF8128L1ZG"],
  ["UKPCB CAF", "23387"],
  ["REGION", "Haridwar, Uttarakhand"],
];

async function fonts() {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Manrope:wght@500;800&family=JetBrains+Mono:wght@400&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());

  const faces = [];
  for (const block of css.split("@font-face").slice(1)) {
    const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
    const url = block.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (!family || !weight || !url) continue;
    const data = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
    faces.push(
      `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;` +
        `src:url(data:font/ttf;base64,${data.toString("base64")}) format('truetype')}`,
    );
  }
  return faces.join("");
}

function html({ eyebrow, title }, { faceCss, photo, mark }) {
  const strip = FACTS.map(
    ([k, v]) =>
      `<li><span class="k">${k}</span><span class="v">${v}</span></li>`,
  ).join("");

  return `<!doctype html><meta charset="utf-8"><style>
    ${faceCss}
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;position:relative;
      font-family:'Manrope',sans-serif;background:#0c2e12}
    .shot{position:absolute;inset:0;background:url(${photo}) center/cover no-repeat}
    .wash{position:absolute;inset:0;background:rgb(12 46 18 / ${OVERLAY})}
    .frame{position:absolute;inset:0;display:flex;flex-direction:column;
      justify-content:space-between;padding:56px 64px}
    .lockup{display:flex;align-items:center;gap:16px}
    .lockup img{width:52px;height:52px}
    .name{font-weight:800;font-size:21px;line-height:1.12;color:#fff;letter-spacing:-0.015em}
    .name span{display:block;font-weight:500;color:#c5d6c8}
    .eyebrow{font-weight:800;font-size:14px;letter-spacing:0.18em;
      text-transform:uppercase;color:#c5d6c8}
    h1{margin-top:18px;font-weight:800;color:#fff;letter-spacing:-0.035em;
      line-height:1.02;font-size:${title.length > 44 ? 60 : 68}px;max-width:15.5ch}
    h1.long{max-width:19ch}
    ul{display:flex;gap:40px;list-style:none;border-top:1px solid rgb(255 255 255 / 0.16);
      padding-top:20px}
    li{display:flex;flex-direction:column;gap:6px}
    .k{font-weight:800;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;
      color:rgb(197 214 200 / 0.62)}
    .v{font-family:'JetBrains Mono',monospace;font-size:15px;color:#c5d6c8}
  </style>
  <div class="shot"></div><div class="wash"></div>
  <div class="frame">
    <div class="lockup"><img src="${mark}" alt=""><p class="name">FirstSources<span>Waste Solutions</span></p></div>
    <div>
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="${title.length > 44 ? "long" : ""}">${title}</h1>
    </div>
    <ul>${strip}</ul>
  </div>`;
}

async function main() {
  mkdirSync(STAGE, { recursive: true });
  console.log("og images:");

  const faceCss = await fonts();

  // Crop the 16:9 poster to the card's 1.9:1 rather than squashing it, and
  // bias the crop upward: the road and the trees carry the frame, the tarmac
  // at the bottom does not.
  const photo =
    "data:image/jpeg;base64," +
    (
      await sharp(join(ROOT, "public/assets/hero/hero-poster.jpg"))
        .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
        .jpeg({ quality: 82 })
        .toBuffer()
    ).toString("base64");

  const mark =
    "data:image/svg+xml;base64," +
    readFileSync(join(ROOT, "public/brand/fsws-white.svg")).toString("base64");

  for (const card of CARDS) {
    const id = card.dir === "" ? "root" : card.dir.replace(/[^a-z]+/gi, "-");
    writeFileSync(`${STAGE}/${id}.html`, html(card, { faceCss, photo, mark }));

    execFileSync(CHROME, [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      `--window-size=${WIDTH},${HEIGHT}`,
      `--screenshot=${WIN_STAGE}\\${id}.png`,
      `file:///${WIN_STAGE.replace(/\\/g, "/")}/${id}.html`,
    ], { stdio: "ignore" });

    const out = join(APP, card.dir, "opengraph-image.jpg");
    if (!existsSync(join(APP, card.dir))) mkdirSync(join(APP, card.dir), { recursive: true });

    // JPEG, not PNG. The card is four fifths photograph, which is exactly what
    // PNG is worst at: the same image is 860 kB lossless and 130 kB at q86,
    // with no visible difference at the size these are ever seen. Sixteen
    // files at the PNG size would have put 14 MB of pictures in the repository.
    const jpg = await sharp(`${STAGE}/${id}.png`)
      .jpeg({ quality: 86, chromaSubsampling: "4:4:4", mozjpeg: true })
      .toBuffer();
    writeFileSync(out, jpg);

    // X reads twitter-image when it is there and og:image otherwise. Giving it
    // its own file is what lets the card be declared summary_large_image with
    // dimensions the crawler can trust.
    copyFileSync(out, join(APP, card.dir, "twitter-image.jpg"));

    console.log(
      `  ${card.dir || "/"}  ${(jpg.length / 1024).toFixed(0)} kB`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
