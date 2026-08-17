import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

import { Hero } from "@/components/sections/hero";
import { ComplianceStrip } from "@/components/sections/compliance-strip";
import { ClientProof } from "@/components/sections/client-proof";
import { Custody } from "@/components/sections/custody";
import { FaqSection } from "@/components/sections/faq";
import {
  Container,
  Section,
  SectionHeader,
} from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { products } from "@/content/products";
import { faqs } from "@/content/services";
import { cta } from "@/content/site";
import { HEADER_OFFSET_NEGATIVE } from "@/lib/layout";

export default function Home() {
  return (
    <>
      {/* First screen. Hero and the registration strip together fill the
          viewport, the way the sister site opens. The negative margin cancels
          the top padding `main` uses to clear the fixed header, so the footage
          runs under the bar to the true top of the page. dvh rather than vh so
          mobile browser chrome cannot push the strip out of view, and min-h
          rather than h so a short viewport lets content grow and scroll
          instead of clipping. */}
      <div className={`${HEADER_OFFSET_NEGATIVE} flex min-h-[100dvh] flex-col`}>
        <Hero />
        <ComplianceStrip />
        {/* watched by the header to decide when to go solid */}
        <div data-hero-sentinel aria-hidden="true" />
      </div>
      <ClientProof />

      <Custody />

      {/* ══ what the material becomes ═════════════════════════════ */}
      <Section ground="tint">
        <Container>
          <SectionHeader
            eyebrow="Output"
            title="What the material becomes"
            lede="Two streams do not leave Haridwar as waste at all. Ash is pressed into masonry, green waste is composted. Both are consented processes, and both are why the end use can be named rather than estimated."
          />
          <Button asChild variant="outline" size="sm" className="mt-7">
            <Link href="/products">All products</Link>
          </Button>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <li key={product.slug}>
                <Panel tone="plain" radius="xl" className="h-full overflow-hidden">
                  {/* inner radius = outer (18px) minus the 1px inset, so the
                      image corner sits concentric with the panel corner */}
                  <div className="relative aspect-4/3 overflow-hidden rounded-t-[17px] bg-green-50">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
                      {product.madeFrom}
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold tracking-[-0.015em] text-green-900">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-ink-600">{product.summary}</p>
                  </div>
                </Panel>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ══ due diligence ═════════════════════════════════════════
          The four questions a procurement or EHS reader asks first, in the
          order they ask them: who signs the certificate, what FSWS is and is
          not registered to do, what the consent covers, and whether the whole
          thing can be inspected. The rest are on /services. Light ground, so
          the tint / light alternation carries through to the dark closing
          band. */}
      <FaqSection
        items={faqs.slice(0, 4)}
        ground="light"
        more={{ href: "/services#faq", label: "All questions" }}
      />

      {/* ══ enquiry ═══════════════════════════════════════════════ */}
      <Section ground="deep">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <SectionHeader
              eyebrow="Next step"
              title="Tell us the site, the streams and the volumes"
              lede="We will come back with a collection schedule, the route each stream would take, and the certificate you would receive for each one."
            />
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild size="lg" variant="light">
                <Link href={cta.primary.href}>
                  {cta.primary.label}
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
