import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { RoutingMap } from "@/components/sections/routing-map";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { streams } from "@/content/streams";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "The material streams FSWS collects, how each is processed, where it ends up, and which party issues the end-use certificate.",
  alternates: { canonical: "/materials" },
};

export default function MaterialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Materials"
        title="Eight streams, and a named destination for each"
        lede="Where the work happens at Haridwar under our own consent, we issue the certificate. Where a mill or a registered recycler performs the recovery, they issue it and we forward it unaltered."
      />

      <Section ground="tint">
        <Container>
          <RoutingMap streams={streams} />
        </Container>
      </Section>

      <Section ground="light">
        <Container>
          <SectionHeader eyebrow="In detail" title="What happens to each stream" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {streams.map((stream) => (
              <li key={stream.slug}>
                <Panel tone="plain" radius="xl" className="flex h-full flex-col p-6">
                  <span aria-hidden="true" className="font-mono text-xs text-green-600">
                    {stream.index}
                  </span>
                  <h2 className="mt-2 text-xl font-extrabold tracking-[-0.015em] text-green-900">
                    {stream.name}
                    {stream.qualifier ? (
                      <span className="block text-sm font-medium text-ink-600">
                        {stream.qualifier}
                      </span>
                    ) : null}
                  </h2>
                  <p className="mt-3 text-sm text-ink-600">{stream.summary}</p>
                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-ink-600">End use</dt>
                      <dd className="text-ink-900">{stream.endUse}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-ink-600">Certificate</dt>
                      <dd className="font-medium text-green-900">{stream.certifier}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto pt-5">
                    <Button asChild variant="link">
                      <Link href={`/materials/${stream.slug}`}>
                        Read the route
                        <ArrowRightIcon aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Panel>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
