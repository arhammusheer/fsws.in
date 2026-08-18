import { z } from "zod";
import { validate } from "./schema";

/**
 * The brand book, transcribed from brand.fsws.in.
 *
 * That site carried fifteen sections. Three of them were true and useful: the
 * logo, the palette and the type system. The rest was positioning copy,
 * scripted phone openers and a pre-send checklist, all of it written before the
 * company had settled what it says, and all of it now contradicted by the site
 * you are reading. Only the three survive here.
 *
 * These hex values are the SOURCE, not a copy of globals.css. The site's ramp
 * is interpolated between the brand greens to give hover states and tints a
 * family to come from, so its intermediate steps are derived and will not all
 * appear here. Where a value exists in both, this file is the one that is
 * right.
 */

const swatchSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9A-F]{6}$/, "hex must be uppercase and six digits"),
  use: z.string(),
  /** Set where the swatch is dark enough that its own name must be reversed. */
  reverse: z.boolean().optional(),
});

const groupSchema = z.object({
  title: z.string(),
  note: z.string(),
  swatches: z.array(swatchSchema).min(1),
});

export const palette = validate(
  z.array(groupSchema).min(1),
  [
    {
      title: "Brand core",
      note: "The forest greens. Headers, buttons, key panels, and every dark ground on the site.",
      swatches: [
        { name: "FSWS Green", hex: "#175C25", use: "Primary actions, success states, buttons", reverse: true },
        { name: "Pine Deep", hex: "#0C2E12", use: "Heroes, covers, footers, dark headers", reverse: true },
        { name: "Pine 800", hex: "#10401A", use: "Borders, deep backgrounds", reverse: true },
        { name: "Pine 700", hex: "#144E1F", use: "Hover states, pressed states", reverse: true },
      ],
    },
    {
      title: "Neutrals and surfaces",
      note: "The majority of any layout. Mint tints are the default ground; white is for cards and emphasis.",
      swatches: [
        { name: "Mint 50", hex: "#F6F8F6", use: "Page backgrounds, the default ground" },
        { name: "Mint 100", hex: "#E8EFE9", use: "Panels, sidebars, secondary areas" },
        { name: "Mist 200", hex: "#C5D6C8", use: "Dividers, subtle fills, borders" },
        { name: "White", hex: "#FFFFFF", use: "Cards, print surfaces, content areas" },
        { name: "Gray", hex: "#94A3B8", use: "Secondary text, captions" },
        { name: "Industrial Slate", hex: "#334155", use: "Charts, neutral text, labels", reverse: true },
        { name: "Charcoal", hex: "#111827", use: "Primary body text on light grounds", reverse: true },
      ],
    },
    {
      title: "Accents",
      note: "Charts, data and secondary highlights. Roughly a tenth of any layout, never more.",
      swatches: [
        { name: "River Blue", hex: "#0B4F6C", use: "Charts, information states, links", reverse: true },
        { name: "Earth Sand", hex: "#C9B79C", use: "Secondary accents, earth tones" },
      ],
    },
    {
      title: "Status",
      note: "Traffic-light logic, and it has to mean the same thing in every document.",
      swatches: [
        { name: "Compliant", hex: "#175C25", use: "Approved, complete, on track", reverse: true },
        { name: "Processed", hex: "#0B4F6C", use: "Information, in progress", reverse: true },
        { name: "Risk", hex: "#F59E0B", use: "Caution, attention needed" },
        { name: "Violation", hex: "#B42318", use: "Error, breach, urgent", reverse: true },
      ],
    },
  ],
  "content/brand.ts:palette",
);

export type SwatchGroup = (typeof palette)[number];
export type Swatch = SwatchGroup["swatches"][number];

export const typefaces = [
  {
    id: "manrope",
    role: "Primary sans",
    name: "Manrope",
    weights: "300 to 800",
    use: "Body copy, headings, interface, captions. Everything unless a rule below applies.",
    specimen: "Waste management that survives an audit",
    never: null,
  },
  {
    id: "playfair",
    role: "Executive serif",
    name: "Playfair Display",
    weights: "500",
    use: "Mission and vision statements, leadership letters, annual report pulls.",
    specimen: "Responsibility begins at the source.",
    never: "Never for tables, labels or interface.",
  },
  {
    id: "mono",
    role: "Technical mono",
    name: "JetBrains Mono",
    weights: "400 to 500",
    use: "Identifiers, manifest numbers, weights, dates, measurements. Anywhere precision is implied.",
    specimen: "U37100UR2019PTC010043",
    never: null,
  },
] as const;

export const scale = [
  { label: "Page title", face: "Manrope 800", detail: "36px, tracking −0.025em" },
  { label: "Section header", face: "Manrope 700", detail: "22px, tracking −0.015em" },
  { label: "Body", face: "Manrope 400", detail: "15px, line height 1.6" },
  { label: "Data", face: "JetBrains Mono 400", detail: "15px, tabular figures" },
] as const;

export const logos = [
  {
    file: "/brand/fsws-green.svg",
    name: "Primary",
    ground: "light" as const,
    use: "Default. White or Mint surfaces, documents and templates.",
  },
  {
    file: "/brand/fsws-white.svg",
    name: "Reversed",
    ground: "deep" as const,
    use: "Dark grounds: heroes, navigation, footers, photography under an overlay.",
  },
  {
    file: "/brand/fsws-black.svg",
    name: "Monochrome",
    ground: "light" as const,
    use: "Greyscale print and one-colour vendor marks. Light grounds only.",
  },
] as const;

export const logoRules = {
  do: [
    "Use on white or Mint grounds",
    "Use the SVG for both print and screen",
    "Keep the proportions and the stroke weights as drawn",
    "On photography, sit it on a backing panel at 90 to 95 per cent opacity",
  ],
  dont: [
    "Stretch, rotate or crop it",
    "Add a shadow, a gradient or a bevel",
    "Recolour the arcs, the lotus or the water separately",
    "Outline it or alter its stroke weights",
    "Place it on a busy background with no backing panel",
  ],
  clearSpace: "A margin on all sides equal to a quarter of the inner circle's diameter.",
  minimums: [
    { label: "Screen", value: "24px", unit: "height" },
    { label: "Print", value: "10mm", unit: "height" },
  ],
} as const;
