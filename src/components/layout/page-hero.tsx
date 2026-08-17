import type { ReactNode } from "react";

import { Container } from "@/components/layout/section";

/**
 * Interior page opener. Eyebrow, heading, lede, on the page's own ground.
 *
 * There is no band. Every attempt to make one work failed for the same reason:
 * a slab of deep green across the top of an otherwise light page is a lid, and
 * a lid cannot be integrated with what is under it. Decorating it did not help
 * (a water motif, a rule, a strip of registration data); nor did dissolving it,
 * because a gradient long enough to dissolve convincingly is also long enough
 * to band, and one short enough not to band still reads as an edge.
 *
 * So the opener sits on green-50, which is the ground the first section of
 * every interior route now uses. It is not a section that ends and hands over
 * to the page: it is the page, with the title at the top of it. Nothing has to
 * be blended because nothing is joined.
 *
 * That leaves type and space to carry it, which is the right way round. The
 * heading runs to 3.5rem with tracking pulled in hard, because at that size the
 * default letterfit is loose and the line stops reading as one object. The
 * eyebrow is the only colour: green-600 against near-black green, small and
 * widely tracked, so it orients without competing.
 *
 * Deep green is now used in exactly two places on this site, the homepage
 * threshold and the closing call to action. Reserving it that way is what gives
 * it force when it does appear.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section
      data-ground="tint"
      className="bg-green-50 pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-16"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="text-[0.7rem] font-bold tracking-[0.18em] text-green-600 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-[2.25rem] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance text-green-900 sm:text-[3rem] lg:text-[3.5rem]">
            {title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-pretty text-ink-600 lg:text-xl">
              {lede}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
