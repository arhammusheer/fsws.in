import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { Container, Label, Section } from "@/components/layout/section";
import { Panel } from "@/components/ui/panel";
import { contact } from "@/content/site";
import { consent, registrations } from "@/content/credentials";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us the site, the streams and the volumes. We will come back with the route each stream would take and the certificate you would receive.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us the site, the streams and the volumes"
        lede="We will come back with a collection schedule, the route each stream would take, and the certificate you would receive for each one."
      />

      <Section ground="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_19rem] lg:gap-16">
            <div className="relative">
              <EnquiryForm />
            </div>

            <aside className="space-y-4">
              <Panel tone="tint" radius="xl" className="p-6">
                <Label>Direct</Label>
                <ul className="mt-4 space-y-2 font-mono text-sm">
                  <li><a href={`mailto:${contact.email}`} className="rounded-sm text-green-900 transition-colors hover:text-green-600">{contact.email}</a></li>
                  <li><a href={contact.phoneHref} className="rounded-sm text-green-900 transition-colors hover:text-green-600">{contact.phone}</a></li>
                  <li><a href={contact.altPhoneHref} className="rounded-sm text-green-900 transition-colors hover:text-green-600">{contact.altPhone}</a></li>
                </ul>
              </Panel>

              <Panel tone="plain" radius="xl" className="p-6">
                <Label>Facility</Label>
                <p className="mt-4 text-sm text-ink-600">{contact.address}</p>
              </Panel>

              <Panel tone="plain" radius="xl" className="p-6">
                <Label>Entity</Label>
                <dl className="mt-4 space-y-2 text-sm">
                  {registrations
                    .filter((r) => ["CIN", "GSTIN"].includes(r.label))
                    .map((r) => (
                      <div key={r.label} className="flex gap-3">
                        <dt className="w-16 shrink-0 text-ink-600">{r.label}</dt>
                        <dd className="font-mono text-ink-900">{r.value}</dd>
                      </div>
                    ))}
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-ink-600">Consent</dt>
                    <dd className="font-mono text-ink-900">CAF {consent.cafId}</dd>
                  </div>
                </dl>
              </Panel>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
