import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { Panel } from "@/components/ui/panel";
import { LogoGrid } from "@/components/ui/logo-grid";
import { clients } from "@/content/services";
import { consent } from "@/content/credentials";
import { contact, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "FirstSources Waste Solutions operates a consented waste processing facility at Haridwar, Uttarakhand, with composting, plastic processing and ash based manufacture on site.",
  alternates: { canonical: "/about" },
};

const plant = [
  { t: "Shredders and sieving", d: "Size reduction and grading ahead of both the block line and onward dispatch." },
  { t: "Blending and pelletising", d: "Ash blending for the masonry line, and pelletising for compost and feed." },
  { t: "Block and brick presses", d: "Cold pressed, ambient cured. No kiln, so the line consumes no firing fuel." },
  { t: "Weighbridge and records", d: "Inward and outward weighment, tied to the consignment record for every load." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A processing site, not a transfer station"
        lede={`Incorporated in ${site.founded} and operating from Haridwar, Uttarakhand. Composting and ash based manufacture happen on our own site under our own consent, which is what lets us name an end use rather than estimate one.`}
      />

      <Section ground="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <SectionHeader eyebrow="The facility" title="Haridwar, Uttarakhand" as="h2" />
            <div>
              <p className="max-w-[62ch] text-lg text-ink-900">
                The site at {contact.address} runs three consented processes: composting, compacting
                and grinding of plastic waste, and ash based manufacture. Material we cannot process
                ourselves is sorted, baled and moved to a named mill or registered recycler, and
                their certificate comes back to the client.
              </p>
              <p className="mt-5 max-w-[62ch] text-ink-600">
                The consent runs to {consent.validTo} under the {consent.authority}. Records are
                retained per consignment and the site is open to inspection.
              </p>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {plant.map((p) => (
                  <li key={p.t}>
                    <Panel tone="tint" radius="lg" className="h-full p-5">
                      <h3 className="font-bold text-green-900">{p.t}</h3>
                      <p className="mt-2 text-sm text-ink-600">{p.d}</p>
                    </Panel>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section ground="tint">
        <Container>
          <SectionHeader
            eyebrow="Clients"
            title="Customers we have served"
            lede="Every consignment is weighed at both ends, routed to a named end use, and closed with a certificate from the party that did the work."
          />
          <LogoGrid clients={clients} className="mt-12 lg:mt-16" />
        </Container>
      </Section>
    </>
  );
}
