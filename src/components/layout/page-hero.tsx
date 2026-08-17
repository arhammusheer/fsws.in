import type { ReactNode } from "react";
import { Container, Label, Section } from "@/components/layout/section";

/** Interior page opener. One threshold per page is enough, so this is quieter
 *  than the homepage hero and carries no footage. */
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
    <Section ground="deep" className="py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="max-w-3xl">
          <Label>{eyebrow}</Label>
          <h1 className="mt-4 text-[2rem] leading-[1.06] font-extrabold tracking-[-0.028em] text-balance text-white sm:text-[2.6rem]">
            {title}
          </h1>
          {lede ? (
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-pretty text-green-200">
              {lede}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </Section>
  );
}
