import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Label, Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  consent, notHeld, publishedCapacities, records, registrations,
} from "@/content/credentials";
import { contact } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Credentials",
  description:
    "Registration, consent and records for FirstSources Waste Solutions. Consolidated Consent to Operate from the Uttarakhand Pollution Control Board, valid to 31 March 2030.",
  path: "/credentials",
});

export default function CredentialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Credentials"
        title="What we are licensed to do, and what we are not"
        lede="Everything below is transcribed from a document that can be produced on request. Where an activity requires a licence FSWS does not hold, that is stated rather than left to be discovered."
      />

      <Section ground="tint">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <SectionHeader eyebrow="Consent to operate" title={consent.instrument} as="h2" />
            <div>
              <p className="max-w-[62ch] text-ink-900">
                Granted by the {consent.authority}, {consent.office}, on {consent.granted}. Issued under:
              </p>
              <ul className="mt-5 max-w-[62ch] space-y-2 text-sm text-ink-600">
                {consent.statutes.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-green-600" />
                    {s}
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "CAF ID", v: consent.cafId },
                  { k: "Application", v: consent.applicationNo },
                  { k: "Valid to", v: consent.validTo },
                ].map((i) => (
                  <Panel key={i.k} tone="tint" radius="lg" className="p-4">
                    <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">{i.k}</dt>
                    <dd className="mt-1.5 font-mono text-lg text-green-900">{i.v}</dd>
                  </Panel>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <Section ground="light">
        <Container>
          <SectionHeader
            eyebrow="Consented capacity"
            title="The figures we publish are the ones on the consent"
            lede="These are authorised capacities from the product schedule, not throughput estimates. Actual monthly volumes are reported per client against weighments."
          />
          <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16">
            {publishedCapacities.map((c) => (
              <Panel key={c.process} tone="plain" radius="xl" className="p-6">
                <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">{c.process}</dt>
                <dd className="mt-3 font-mono text-3xl text-green-900">{c.quantity}</dd>
                <dd className="mt-1 text-sm text-ink-600">{c.period}</dd>
              </Panel>
            ))}
          </dl>
        </Container>
      </Section>

      <Section ground="tint">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div>
              <SectionHeader eyebrow="Scope" title="Licences held by others" as="h2" />
              <p className="mt-5 max-w-[56ch] text-sm text-ink-600">
                Where FSWS is not the licensed party, the licensed party performs the recovery and
                issues the certificate. FSWS forwards it unaltered, with the consignment reference attached.
              </p>
            </div>
            <dl className="grid gap-4">
              {notHeld.map((n) => (
                <Panel key={n.activity} tone="plain" radius="lg" className="p-5">
                  <dt className="font-bold text-green-900">{n.activity}</dt>
                  <dd className="mt-2 max-w-[62ch] text-sm text-ink-600">{n.note}</dd>
                </Panel>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <Section ground="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Label>Registration</Label>
              <dl className="mt-6">
                {registrations.map((r) => (
                  <div key={r.label} className="grid grid-cols-[10rem_1fr] gap-4 border-t border-ink-200 py-4 text-sm">
                    <dt className="text-ink-600">{r.label}</dt>
                    <dd className="font-mono text-green-900">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <Label>Retained per consignment</Label>
              <ul className="mt-6">
                {records.map((r) => (
                  <li key={r} className="border-t border-ink-200 py-4 text-sm text-ink-900">{r}</li>
                ))}
              </ul>
              <p className="mt-8 max-w-[52ch] text-sm text-ink-600">
                The Haridwar facility and the consignment records are open to inspection. Visits to a
                receiving mill or recycler can be arranged. Copies of the consent, and of downstream
                partners’ registrations, are provided on request and reissued on renewal or change of partner.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-6">
                <Link href="/contact">Request documents</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section ground="deep" className="py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <p className="max-w-[42ch] text-lg text-green-200">
              Due diligence questions are usually quicker on a call than by email. {contact.phone}.
            </p>
            <Button asChild size="lg" variant="light">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
