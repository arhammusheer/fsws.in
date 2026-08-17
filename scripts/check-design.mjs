#!/usr/bin/env node
/**
 * Design rule guard. Runs in `npm run check`.
 *
 * Two rules are absolute for this brand and easy to reintroduce by accident,
 * usually by pasting in a shadcn component that ships `shadow-xs` in its
 * variants:
 *
 *   no shadows   any shadow-* utility, box-shadow, or drop-shadow
 *   no gradients any bg-gradient / linear-gradient / radial-gradient
 *
 * Depth on this site comes from radius, layered borders and a darker lip that
 * compresses on press. If a component seems to need a shadow, it needs a lip.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = ["src"];
const EXT = /\.(tsx?|css)$/;

/* Files allowed to use the pressed-key lip. Everything else must stay flat:
   putting it on cards too made every surface look tappable. */
const LIP_ALLOWED = ["src/components/ui/button.tsx", "src/components/layout/mobile-nav.tsx"];

/* The header's progressive scrim uses a linear-gradient as a MASK, to fade a
   blur out downward, not as a decorative fill. That is the one legitimate use
   and it is confined to this file. Anywhere else, a gradient is still a bug. */
const GRADIENT_ALLOWED = ["src/components/layout/header.tsx"];

const RULES = [
  {
    name: "lip",
    pattern: /border-[bt]-\[?[23]px?\]?\s|border-[bt]-2\b|border-b-\[3px\]/g,
    why: "the pressed-key lip is for buttons only: keep other surfaces flat",
    only: LIP_ALLOWED,
  },
  {
    name: "shadow",
    // shadow-none is fine: it is how we strip a shadow off a vendor component
    pattern: /\bshadow-(?!none\b)[a-z0-9[\]/.-]+|box-shadow|drop-shadow|\bring-(?!offset-0\b)[a-z0-9[\]/.-]+/g,
    why: "no shadows: Tailwind rings compile to box-shadow too. Use radius plus a darker bottom border (a lip), and rely on the global :focus-visible outline",
  },
  {
    name: "gradient",
    pattern: /\bbg-gradient-|linear-gradient|radial-gradient|conic-gradient/g,
    why: "no gradients: use a flat fill or a tonal step from the colour ramp",
    only: GRADIENT_ALLOWED,
  },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.test(entry)) out.push(full);
  }
  return out;
}

let failures = 0;
for (const dir of SCAN) {
  for (const file of walk(join(ROOT, dir))) {
    const source = readFileSync(file, "utf8");
    source.split("\n").forEach((line, i) => {
      // a line that only explains the rule is not a violation of it
      if (/^\s*(\*|\/\/)/.test(line)) return;
      for (const rule of RULES) {
        if (rule.only?.some((allowed) => file.endsWith(allowed))) continue;
        rule.pattern.lastIndex = 0;
        const hit = rule.pattern.exec(line);
        if (hit) {
          failures += 1;
          console.error(
            `${relative(ROOT, file)}:${i + 1}  ${rule.name}: "${hit[0]}"\n    ${rule.why}`,
          );
        }
      }
    });
  }
}

if (failures) {
  console.error(`\n${failures} design rule violation(s).`);
  process.exit(1);
}
console.log("design rules: no shadows, no gradients, lips on buttons only — clean");
