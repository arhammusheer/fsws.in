import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Client } from "@/content/services";

/**
 * Bordered logo wall, built here rather than installed.
 *
 * The hairlines between cells are not borders. The wrapper is painted in the
 * hairline colour and the cells sit on it with a 1px gap, so every rule is
 * exactly one pixel, they never double up where cells meet, and they stay
 * continuous at any column count. Adding a border per cell would give 2px
 * seams internally and 1px at the edges.
 *
 * The wall is laid out for EIGHT logos: four rows of two on a phone, two rows
 * of four from md. It deliberately skips a three-column step, because eight
 * does not divide by three and the last row would break the rectangle.
 *
 * Any shortfall is padded so the rectangle closes. Without that padding a
 * partial last row leaves the wrapper colour showing as a solid slab, which
 * reads as a rendering fault rather than a gap.
 *
 * The first pad cell carries "and more", which is both true and useful: these
 * are the marks we have permission and artwork for, not the whole customer
 * list. It also gives the eye somewhere to land at the end of the run instead
 * of an empty box. Any pad cells after the first stay blank, because repeating
 * the line would read as filler. When the wall is full the line does not
 * appear at all, which is correct: the grid ends on a mark.
 *
 * Marks rest in greyscale and lift to full colour on hover, as the reference
 * does, but only where the device actually has a pointer. On touch there is no
 * hover to reveal the colour, so the greyscale is never applied and the marks
 * are shown as they are.
 *
 * Every mark is set to the same height, then corrected optically where that is
 * not enough: `client.scale` shrinks or lifts an individual one so the row
 * reads even. It is a transform rather than a height so the cell geometry stays
 * identical whatever the correction.
 *
 * No shadows: the cell highlight on hover is a tint change, not a lift.
 */

const COLUMNS = 4;

export function LogoGrid({
  clients,
  className,
}: {
  clients: readonly Client[];
  className?: string;
}) {
  const remainder = clients.length % COLUMNS;
  const blanks = remainder === 0 ? 0 : COLUMNS - remainder;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-ink-200 bg-ink-200",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-px md:grid-cols-4">
        {clients.map((client) => (
          <div
            key={client.name}
            className="group flex h-28 items-center justify-center bg-white px-6 transition-colors duration-200 hover:bg-green-50 sm:h-30 lg:h-32"
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={280}
              height={96}
              style={
                client.scale ? { transform: `scale(${client.scale})` } : undefined
              }
              className={cn(
                "h-12 w-auto max-w-full object-contain transition-[filter] duration-300 sm:h-14 lg:h-16",
                "[@media(hover:hover)]:grayscale",
                "[@media(hover:hover)]:group-hover:grayscale-0",
              )}
            />
          </div>
        ))}

        {Array.from({ length: blanks }, (_, i) => (
          <div
            key={`blank-${i}`}
            aria-hidden={i === 0 ? undefined : true}
            className="flex h-28 items-center justify-center bg-white px-6 sm:h-30 lg:h-32"
          >
            {i === 0 ? (
              <span
                className="text-[0.7rem] font-bold tracking-[0.16em] uppercase"
                style={{ color: "var(--label)" }}
              >
                and more
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
