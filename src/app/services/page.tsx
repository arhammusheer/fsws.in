import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { FaqSection, faqJsonLd } from "@/components/sections/faq";
import { faqs, services } from "@/content/services";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Collection and segregation, end-use documentation, reporting, electronic equipment and batteries, and waste audits.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <PageHero
        eyebrow="Services"
        title="What we take on, and what you get back"
        lede="The collection is the easy part. The value is in what arrives afterwards: weights you can publish and certificates that name the party who did the work."
      />

      <Section ground="tint">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Panel tone="plain" radius="xl" className="h-full p-6 lg:p-7">
                  <span aria-hidden="true" className="font-mono text-xs text-green-600">
                    {service.index}
                  </span>
                  <h2 className="mt-2 text-xl font-extrabold tracking-[-0.015em] text-green-900">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-[52ch] text-ink-600">{service.summary}</p>
                  <ul className="mt-5 space-y-2.5">
                    {service.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-ink-900">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-green-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </Panel>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FaqSection
        items={faqs}
        ground="light"
        lede="The full set. Every answer here is one we can produce a document for."
      />

      <Section ground="deep" className="py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <h2 className="max-w-[30ch] text-3xl font-extrabold tracking-[-0.025em] text-balance text-white sm:text-4xl">
              Tell us the site, the streams and the volumes
            </h2>
            <Button asChild size="lg" variant="light">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
