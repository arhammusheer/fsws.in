import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout/section";
import { Waves } from "@/components/ui/waves";

/**
 * Interior page opener.
 *
 * The first version was an eyebrow, a heading and a lede on a flat green band,
 * which is the default shape every site arrives at and reads as a placeholder
 * for a design rather than one. Three things carry it now, none of which need a
 * shadow or a gradient.
 *
 * The eyebrow sits on a rule that runs the full measure. It is a print device:
 * it establishes the page's left edge and its width in one stroke, before any
 * prose, and it gives the block a top edge to hang from.
 *
 * The water motif from the mark is anchored bottom right and bleeds off two
 * edges. It is stretched wide by `preserveAspectRatio="none"`, so the crests
 * flatten into long swells rather than reading as a repeating border. Its dense
 * side is clear of the measure; the far left of the field does pass behind the
 * end of the lede, where green-600 on green-900 is 1.83:1 and the hairline is
 * imperceptible against the type. Anything heavier than a hairline, or any
 * lighter green, would have to be moved clear of the text.
 *
 * The meta strip closes the band with the facts that page is actually about,
 * set in mono under a hairline. It is the same device as the registration
 * ticker under the homepage hero, which is what ties the interior pages to the
 * front of the site, and it means the opener carries evidence rather than only
 * announcing a subject. Pages that have nothing factual to put there omit it,
 * and the strip and its rule disappear with it.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Facts for the closing strip. Two to four reads best. */
  meta?: readonly { label: string; value: string }[];
  children?: ReactNode;
}) {
  return (
    <Section
      ground="deep"
      flush
      className="border-b border-green-800 pt-14 pb-0 sm:pt-16 lg:pt-20"
    >
      <Waves
        count={5}
        amplitude={7}
        gap={18}
        seed={34}
        className="right-0 -bottom-8 h-[22rem] w-[46rem] text-green-600 opacity-70 lg:h-[26rem] lg:w-[62rem]"
      />

      <Container>
        <div className="flex items-center gap-5 border-b border-green-800 pb-4">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] text-green-200 uppercase">
            {eyebrow}
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-green-800" />
        </div>

        <div className="max-w-3xl pt-10 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20">
          <h1 className="text-[2.1rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-balance text-white sm:text-[2.75rem] lg:text-[3.1rem]">
            {title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-pretty text-green-200">
              {lede}
            </p>
          ) : null}
          {children}
        </div>

        {meta && meta.length > 0 ? (
          <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-green-800 py-4 md:gap-x-14">
            {meta.map((item) => (
              <div key={item.label} className="flex items-baseline gap-2.5">
                <dt className="text-[0.62rem] font-bold tracking-[0.16em] text-green-200/60 uppercase">
                  {item.label}
                </dt>
                <dd className="font-mono text-[0.78rem] text-green-200">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </Section>
  );
}
