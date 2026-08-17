import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/content/services";

/**
 * The due-diligence questions, as one component used in two places.
 *
 * The homepage carries the first few and links on; `/services` carries the
 * whole set. Splitting it that way rather than repeating all eight follows what
 * the rest of the site already does with products and with the custody chain:
 * the homepage shows enough to prove the page is worth trusting, the interior
 * route holds the complete answer. It also keeps one copy of each answer, so
 * there is one place to correct when a registration or a capacity changes.
 *
 * The heading sits in its own column beside the list rather than above it. At
 * this width a stack of accordion rows under a centred title reads as a support
 * page; ranged beside a short heading it reads as part of the argument.
 */
export function FaqSection({
  items,
  ground = "tint",
  eyebrow = "Due diligence",
  title = "Questions we are asked",
  lede,
  more,
}: {
  items: readonly Faq[];
  ground?: "light" | "tint";
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** Shown under the heading when this is a subset of the full list. */
  more?: { href: string; label: string };
}) {
  return (
    <Section ground={ground} id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow={eyebrow} title={title} lede={lede} />
            {more ? (
              <Button asChild variant="link" className="mt-6">
                <Link href={more.href}>
                  {more.label}
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>

          <Panel tone="plain" radius="xl" className="px-6 lg:px-8">
            <Accordion type="single" collapsible className="w-full">
              {items.map((faq, i) => (
                <AccordionItem key={faq.question} value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Panel>
        </div>
      </Container>
    </Section>
  );
}

/**
 * FAQPage structured data. Emitted from `/services` only, where the full set
 * lives: repeating it on the homepage for a subset would publish the same
 * questions at two URLs and give search engines a duplicate to choose between.
 */
export function faqJsonLd(items: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
