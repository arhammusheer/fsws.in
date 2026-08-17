#!/usr/bin/env node
/**
 * Design rule guard. Runs in `npm run check`.
 *
 * Three rules are absolute for this brand and easy to reintroduce by accident,
 * usually by pasting in a shadcn component that ships `shadow-xs` in its
 * variants:
 *
 *   no shadows   any shadow-* utility, box-shadow, or drop-shadow
 *   no gradients any bg-gradient / linear-gradient / radial-gradient
 *   no bevels    a thick bottom border faking a lip under a control
 *
 * Everything here is flat. Surfaces are separated by radius, a hairline border
 * and a tonal step from the colour ramp, and nothing else. Buttons used to be
 * the one exception, sitting on a pressed-key lip; that is gone, and the rule
 * now applies everywhere with no allow list.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = ["src"];
const EXT = /\.(tsx?|css)$/;

/* The header's progressive scrim uses a linear-gradient as a MASK, to fade a
   blur out downward, not as a decorative fill. That is the one legitimate use
   and it is confined to this file. Anywhere else, a gradient is still a bug.

   The interior page opener was briefly on this list. It is not any more: the
   band it was dissolving has been removed entirely. */
const GRADIENT_ALLOWED = ["src/components/layout/header.tsx"];

const RULES = [
  {
    name: "bevel",
    pattern: /border-[bt]-\[?[23]px?\]?\s|border-[bt]-2\b|border-b-\[3px\]/g,
    why: "no bevels: every surface is flat. Separate things with radius, a hairline border and a tonal step",
  },
  {
    name: "shadow",
    // shadow-none is fine: it is how we strip a shadow off a vendor component
    pattern: /\bshadow-(?!none\b)[a-z0-9[\]/.-]+|box-shadow|drop-shadow|\bring-(?!offset-0\b)[a-z0-9[\]/.-]+/g,
    why: "no shadows: Tailwind rings compile to box-shadow too. Use radius and a hairline border, and rely on the global :focus-visible outline",
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
console.log("design rules: no shadows, no gradients, no bevels — clean");
