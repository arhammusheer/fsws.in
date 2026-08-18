import Image from "next/image";
import { XIcon } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { Label } from "@/components/layout/section";

/**
 * The logo rules, drawn instead of described.
 *
 * Both halves of this were prose before, and prose is where logo rules go to be
 * ignored. "A margin equal to a quarter of the inner circle's diameter" is a
 * sentence you have to construct a picture from, and everyone constructs a
 * different one. "Do not stretch the logo" is agreed with by every person who
 * then stretches the logo, because they have never seen what it looks like when
 * it happens and so do not recognise it as the thing they were warned about.
 *
 * CLEAR SPACE
 *
 * The inner circle measures 363px against an overall artwork width of 743px, so
 * a quarter of it is 91px, which is 12.2 per cent of the mark's height. That
 * second number is the one anyone can actually use: the rule is unchanged, but
 * it can now be applied with a ruler rather than by finding the inner circle
 * first. The diagram carries both, so the derivation is visible and can be
 * rechecked if the artwork is ever redrawn.
 *
 * MISUSE
 *
 * Every wrong example is the real SVG being distorted live by the browser, not
 * a screenshot of a mistake. Nothing can drift out of date, and the distortions
 * are honest: what you see is exactly what that CSS does to the mark.
 *
 * That is why this file is on the misuse allow list in
 * scripts/check-design.mjs. It uses a drop-shadow and a gradient deliberately,
 * to show what they look like on the mark, and the guard has to let the one
 * file whose job is rendering the prohibition do so.
 */

/**
 * Two different denominators, and mixing them up is what made the first
 * attempt at this diagram wrong.
 *
 * A person measuring the rule measures the INK: the artwork is 743px wide in
 * an 800px canvas, so the mark has about 7 per cent of empty margin built in.
 * CSS, meanwhile, sizes everything against the element, which is the canvas.
 *
 * INK_RATIO converts between the two. CLEAR_OF_INK is the rule as a human
 * applies it; CLEAR is the same distance expressed against the element so the
 * dashed box lands where the rule actually puts it.
 */
const INK_RATIO = 743 / 800;
const CLEAR_OF_INK = 0.122;
const CLEAR = CLEAR_OF_INK * INK_RATIO;

/** The inner circle: 363px across, centred at (399, 418) in the 800px canvas. */
const INNER = { size: 363 / 800, cx: 399 / 800, cy: 418 / 800 };

const MISUSE = [
  {
    label: "Stretched",
    why: "Proportions are fixed",
    style: { transform: "scaleX(1.45)" },
  },
  {
    label: "Rotated",
    why: "The mark sits level",
    style: { transform: "rotate(14deg)" },
  },
  {
    label: "Shadowed",
    why: "No shadow, glow or bevel",
    style: { filter: "drop-shadow(0 6px 10px rgb(0 0 0 / 0.45))" },
  },
  {
    label: "Recoloured",
    why: "Never restyle the strokes",
    style: { filter: "hue-rotate(115deg) saturate(2.6)" },
  },
] as const;

export function ClearSpace() {
  return (
    <Panel tone="plain" radius="xl" className="flex h-full flex-col p-6 lg:p-7">
      <Label>Clear space</Label>
      <p className="mt-4 max-w-[46ch] text-sm text-ink-600">
        A margin on all sides equal to a quarter of the inner circle&apos;s
        diameter. On this artwork that is 12.2 per cent of the mark&apos;s
        height, which is the easier way to apply it.
      </p>

      <div className="mt-8 flex flex-1 items-center justify-center">
        <div
          className="relative border border-dashed border-green-300"
          style={{ padding: `${CLEAR * 100}%` }}
        >
          {/* the mark, with the inner circle it is measured from called out */}
          <div className="relative w-40 lg:w-44">
            <Image
              src="/brand/fsws-green.svg"
              alt="FSWS mark with its clear space marked"
              width={176}
              height={176}
              className="w-full"
            />
            <span
              aria-hidden="true"
              className="absolute rounded-full border border-green-600/45"
              style={{
                width: `${INNER.size * 100}%`,
                height: `${INNER.size * 100}%`,
                left: `${(INNER.cx - INNER.size / 2) * 100}%`,
                top: `${(INNER.cy - INNER.size / 2) * 100}%`,
              }}
            />
          </div>

          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 font-mono text-[0.62rem] text-green-600"
          >
            d/4
          </span>
          <span
            aria-hidden="true"
            className="absolute top-1/2 -right-3 translate-x-full -translate-y-1/2 font-mono text-[0.62rem] whitespace-nowrap text-green-600"
          >
            d = inner circle
          </span>
        </div>
      </div>
    </Panel>
  );
}

export function Misuse() {
  return (
    <div>
      <Label>What this looks like when it goes wrong</Label>
      <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {MISUSE.map((item) => (
          <li key={item.label}>
            <Tile label={item.label} why={item.why}>
              <span className="flex size-full items-center justify-center overflow-hidden">
                <Image
                  src="/brand/fsws-green.svg"
                  alt=""
                  width={96}
                  height={96}
                  className="size-16 lg:size-[4.5rem]"
                  style={item.style}
                />
              </span>
            </Tile>
          </li>
        ))}

        {/* The one that cannot be done with a filter: it needs something busy
            to sit on. Same photograph the hero uses. */}
        <li>
          <Tile label="No backing panel" why="On photography, use one">
            <span className="relative flex size-full items-center justify-center overflow-hidden">
              <Image
                src="/assets/hero/hero-poster.jpg"
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              <Image
                src="/brand/fsws-white.svg"
                alt=""
                width={96}
                height={96}
                className="relative size-16 opacity-90 lg:size-[4.5rem]"
              />
            </span>
          </Tile>
        </li>
      </ul>
    </div>
  );
}

function Tile({
  label,
  why,
  children,
}: {
  label: string;
  why: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      <div className="relative flex h-28 items-center justify-center bg-green-50 lg:h-32">
        {children}
      </div>
      <figcaption className="border-t border-ink-200 p-3">
        <p className="flex items-center gap-1.5 text-xs font-bold text-destructive">
          <XIcon aria-hidden="true" className="size-3.5 shrink-0" />
          {label}
        </p>
        <p className="mt-1 text-[0.7rem] leading-snug text-ink-600">{why}</p>
      </figcaption>
    </figure>
  );
}
