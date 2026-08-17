import { cn } from "@/lib/utils";

/**
 * The water from the lower half of the mark, ported from the print work
 * (`end-use-presentation/build.py:waves`).
 *
 * Each line is jittered independently, in both amplitude and in the width of
 * every crest, so the set never reads as a mechanical repeat. That is the point
 * of the motif: the waves inside the mark are not identical to one another, and
 * a set of evenly stamped sine curves looks like a border pattern rather than
 * like water.
 *
 * The jitter comes from a seeded generator written out here rather than
 * `Math.random`. It has to be deterministic or the server and the client draw
 * different paths and React reports a hydration mismatch. mulberry32 is small,
 * has no dependencies and is stable across runtimes, which is all that is
 * required of it. Changing the seed changes the drawing; keep it fixed once a
 * page ships.
 *
 * Strokes are `currentColor` with `vector-effect="non-scaling-stroke"`, so the
 * hairline stays one pixel however far the viewBox is stretched. On the deep
 * ground this is green-600 on green-900, 1.83:1, decorative only. It must never
 * sit behind text that has to be read.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Waves({
  count = 5,
  amplitude = 7,
  gap = 18,
  seed = 34,
  className,
}: {
  /** Lines in the set. */
  count?: number;
  /** Crest height before jitter. */
  amplitude?: number;
  /** Vertical distance between lines. */
  gap?: number;
  /** Fixed, so server and client draw the same thing. */
  seed?: number;
  className?: string;
}) {
  const random = mulberry32(seed);
  const paths: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const y = 12 + i * gap;
    const a = amplitude * (0.72 + random() * 0.56);
    let x = -10;
    let sign = i % 2 === 0 ? 1 : -1;
    let d = `M -10 ${y.toFixed(2)}`;

    for (let k = 0; k < 4; k += 1) {
      const span = 30 * (0.85 + random() * 0.3);
      d += ` Q ${(x + span / 2).toFixed(2)} ${(y - sign * a).toFixed(2)} ${(
        x + span
      ).toFixed(2)} ${y.toFixed(2)}`;
      x += span;
      sign = -sign;
    }

    paths.push(d);
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute", className)}
    >
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
