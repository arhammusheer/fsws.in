#!/usr/bin/env node
/**
 * Generate every icon the site needs from the one brand mark.
 *
 *   npm run icons
 *
 * The base lockup is the GREEN mark, so that is what these are, and they are
 * transparent: the mark sits on whatever is behind it.
 *
 * Two exceptions, both forced by the platform rather than chosen:
 *
 *   apple-icon   iOS composites its own rounded tile and paints black behind
 *                any alpha it finds, so a transparent icon arrives as a green
 *                mark on black. It is flattened onto white.
 *   maskable     Android crops the icon to a circle or squircle of its own
 *                choosing. The margin that makes that safe only reads as
 *                margin if there is something filling it, so this one keeps
 *                its ground too.
 *
 * Padding is deliberately small. The mark is already a circle inside a square
 * canvas, so it brings its own optical margin; adding more just shrinks the
 * artwork and blurs it further at the sizes that matter.
 *
 * `favicon.ico` is assembled here rather than by a library. Sharp has no ICO
 * encoder, and an ICO is only a header, one directory entry per image and the
 * PNG payloads concatenated, so writing the 22 bytes of structure directly is
 * fewer moving parts than another dependency.
 *
 * Outputs, all committed:
 *
 *   src/app/favicon.ico       16, 32, 48, each framed for its own size
 *   src/app/icon.svg          scales indefinitely; browsers that support it
 *                             prefer it over the raster
 *   src/app/icon.png          512, the generic PNG fallback
 *   src/app/apple-icon.png    180, opaque on white, see above
 *   public/icon-192.png       manifest
 *   public/icon-512.png       manifest
 *   public/icon-maskable.png  manifest, with the safe-zone padding Android
 *                             needs before it applies its own mask
 *
 * Next's file conventions pick up everything in src/app automatically and emit
 * the link tags; app/manifest.ts references the two in public.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, "src/app");
const PUBLIC = join(ROOT, "public");

/** The ground used only where transparency is not an option. The manifest's
 *  theme colour lives in src/app/manifest.ts. */
const FIELD = "#ffffff";

const MARK = readFileSync(join(PUBLIC, "brand/fsws-green.svg"), "utf8");

/**
 * The mark over its field, as SVG, at a given inset.
 *
 * Rendering the source at the target size and compositing would resample the
 * artwork twice. Wrapping it means sharp rasterises the vector once, straight
 * to the size asked for.
 */
function plate(inset, field = null) {
  const box = 300;
  const size = box - inset * 2;
  const inner = MARK
    // strip the XML prolog and any doctype so it can be nested
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    // the source declares its size in mm; nested, it must inherit ours
    .replace(/<svg([^>]*)>/, (_, attrs) =>
      `<svg${attrs
        .replace(/\swidth="[^"]*"/, "")
        .replace(/\sheight="[^"]*"/, "")} width="${size}" height="${size}" x="${inset}" y="${inset}">`,
    );

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}" width="${box}" height="${box}">` +
      (field ? `<rect width="${box}" height="${box}" fill="${field}"/>` : "") +
      inner +
      `</svg>`,
  );
}

/**
 * An optical ladder, not one artwork scaled down.
 *
 * The badge holds four concentric arcs, a ridge, a lotus and three lines of
 * water. Rendered whole at 16px all of that collapses into a grey-green smudge:
 * the detail is not small, it is gone. So the small sizes crop
 * INTO the mark rather than shrinking it, letting the outer rings fall off the
 * tile so the lotus is what survives. It is the same artwork throughout, only
 * framed for the size it will be seen at, which is how a mark is supposed to
 * behave across optical sizes.
 *
 * Negative inset means the mark is drawn larger than the tile and clipped by
 * it. Checked at each size before choosing:
 *
 *   16  the lotus alone reads, and only past about a 2x crop
 *   32  lotus plus the innermost ring, still clearly the badge
 *   48+ the whole badge, which is what the mark actually is
 */
const CROP = { 16: -120, 32: -40 };
const STANDARD = plate(10);
const forSize = (size) => (size in CROP ? plate(CROP[size]) : STANDARD);

/** Android masks icons to a circle or squircle and can crop up to 20% a side.
 *  56/300 keeps the badge inside the guaranteed safe zone, and this is the one
 *  icon that has to carry a ground for that margin to read. */
const MASKABLE = plate(56, FIELD);

/**
 * Make the SVG icon answer to the browser's colour scheme.
 *
 * Transparency is what was asked for, and it has a cost: the mark is dark
 * green, so on a dark tab strip it nearly disappears. A raster icon can do
 * nothing about that, but an SVG is a document and can carry a media query, so
 * this one turns the mark white when the browser is in dark mode and keeps it
 * green otherwise. Chrome, Firefox and Safari all prefer the SVG icon when one
 * is offered, so this is what most people will actually see; the .ico stays
 * green for the browsers that fall back to it.
 *
 * `!important` is required rather than sloppy: the source sets its colour in a
 * `style` attribute, which is an inline style, and nothing but `!important`
 * outranks one.
 */
const darkAware = (svg) =>
  Buffer.from(
    svg
      .toString()
      // after the wrapper's own opening tag, which is the one element every
      // plate has whether or not it carries a ground
      .replace(
        /^(<svg[^>]*>)/,
        `$1<style>@media (prefers-color-scheme: dark) {` +
          `path, circle, ellipse, polygon { fill: #ffffff !important; }` +
          `}</style>`,
      ),
  );

const png = (svg, size) =>
  sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** ICO: 6 byte header, 16 bytes per entry, then the PNG payloads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette colours, 0 for PNG
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const write = (path, data) => {
  writeFileSync(path, data);
  console.log(`  ${path.replace(ROOT, "")}  ${(data.length / 1024).toFixed(1)} kB`);
};

async function main() {
  mkdirSync(PUBLIC, { recursive: true });

  console.log("icons:");

  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map(async (size) => ({ size, data: await png(forSize(size), size) })),
  );
  write(join(APP, "favicon.ico"), ico(images));

  // The vector favicon: same construction, written out as SVG so it stays
  // sharp at any density and costs a fraction of the PNG, plus the one thing a
  // vector icon can do that a raster cannot.
  write(join(APP, "icon.svg"), darkAware(STANDARD));

  write(join(APP, "icon.png"), await png(STANDARD, 512));
  write(
    join(APP, "apple-icon.png"),
    await sharp(STANDARD, { density: 384 })
      .resize(180, 180)
      // iOS paints black behind any alpha, so this one cannot be transparent
      .flatten({ background: FIELD })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  );

  write(join(PUBLIC, "icon-192.png"), await png(STANDARD, 192));
  write(join(PUBLIC, "icon-512.png"), await png(STANDARD, 512));
  write(join(PUBLIC, "icon-maskable.png"), await png(MASKABLE, 512));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
