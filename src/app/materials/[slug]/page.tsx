import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Label, Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { streamBySlug, streams } from "@/content/streams";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return streams.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/materials/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const stream = streamBySlug(slug);
  if (!stream) return {};
  const name = stream.qualifier ? `${stream.name}, ${stream.qualifier}` : stream.name;
  return pageMetadata({
    title: name,
    description: stream.summary,
    path: `/materials/${stream.slug}`,
  });
}

export default async function StreamPage({ params }: PageProps<"/materials/[slug]">) {
  const { slug } = await params;
  const stream = streamBySlug(slug);
  if (!stream) notFound();
  const inHouse = stream.processedBy === "fsws";

  return (
    <>
      <PageHero
        eyebrow={`Stream ${stream.index}`}
        title={stream.qualifier ? `${stream.name}, ${stream.qualifier}` : stream.name}
        lede={stream.summary}
      />

      <Section ground="tint">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <Panel tone="tint" radius="xl" className="h-fit p-6">
              <span aria-hidden="true" className="font-mono text-sm text-green-600">
                {stream.index}
              </span>
              <dl className="mt-4 space-y-5">
                <div>
                  <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
                    Processed by
                  </dt>
                  <dd className="mt-1.5 font-medium text-green-900">
                    {inHouse ? "FSWS, Haridwar" : stream.certifier}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
                    Certificate issued by
                  </dt>
                  <dd className="mt-1.5 font-medium text-green-900">{stream.certifier}</dd>
                  <dd className="mt-2 text-sm text-ink-600">
                    {inHouse
                      ? "The work is carried out at our facility under our own consent, so we issue the certificate directly."
                      : "The licence sits with the processor, so they issue the certificate and we forward it unaltered."}
                  </dd>
                </div>
              </dl>
            </Panel>

            <dl>
              {stream.detail.map((d) => (
                <div
                  key={d.label}
                  className="grid gap-2 border-t border-ink-200 py-7 sm:grid-cols-[9rem_1fr] sm:gap-8"
                >
                  <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase sm:pt-1">
                    {d.label}
                  </dt>
                  <dd className="max-w-[62ch] text-ink-900">{d.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <Section ground="light" className="py-12 sm:py-14 lg:py-16">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Label>Other streams</Label>
            <Button asChild variant="link">
              <Link href="/materials">Back to all materials</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {streams
              .filter((s) => s.slug !== stream.slug)
              .map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/materials/${s.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-600 transition-colors hover:border-green-300 hover:text-green-700"
                  >
                    <span className="font-mono text-xs text-green-600">{s.index}</span>
                    {s.name}
                  </Link>
                </li>
              ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
