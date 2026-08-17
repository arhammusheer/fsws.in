import { cn } from "@/lib/utils";

/**
 * The concentric-ring field from the mark, ported from the print work
 * (`end-use-presentation/build.py:arcs`).
 *
 * The gap between rings is eased rather than stepped:
 *
 *     gap(t) = gapMin + (gapMax - gapMin) * t**power
 *
 * A power well above 1 holds the gap near gapMin through the first half, so the
 * core stays dense and the field only opens out late. A constant multiplier was
 * tried first in print and reads mechanical: it is regular in log space, so
 * every ring sits the same proportional step from the last. This is what makes
 * it read as a ripple rather than as a target.
 *
 * Geometry is a pure function of the props, so server and client render
 * identically and there is no hydration risk. The seeded randomness lives in
 * the wave motif, not here.
 *
 * Strokes are `currentColor` at `vector-effect="non-scaling-stroke"`, so the
 * hairline stays one pixel however far the SVG is scaled up. Colour and opacity
 * are the caller's business. On the deep ground that pairing is green-600 on
 * green-900, which is 1.83:1 and decorative only: it must never carry text.
 */
export function Ripple({
  count = 22,
  r0 = 6,
  gapMin = 3,
  gapMax = 34,
  power = 2.6,
  className,
}: {
  /** Rings to draw, before the viewBox clips them. */
  count?: number;
  /** Radius of the innermost ring. */
  r0?: number;
  gapMin?: number;
  gapMax?: number;
  /** Easing exponent. Above 1 keeps the core dense. */
  power?: number;
  className?: string;
}) {
  const radii: number[] = [];
  let r = r0;

  for (let i = 0; i < count; i += 1) {
    if (r > 200) break;
    radii.push(r);
    const t = i / (count - 1);
    r += gapMin + (gapMax - gapMin) * t ** power;
  }

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute", className)}
    >
      {radii.map((radius) => (
        <circle
          key={radius}
          cx={200}
          cy={200}
          r={radius}
          fill="none"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
