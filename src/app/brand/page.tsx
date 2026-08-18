import type { Metadata } from "next";
import Image from "next/image";
import { CheckIcon, XIcon } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Label, Section, SectionHeader } from "@/components/layout/section";
import { Panel } from "@/components/ui/panel";
import { Swatch } from "@/components/sections/swatch";
import { logoRules, logos, palette, scale, typefaces } from "@/content/brand";
import { pageMetadata } from "@/lib/seo";

/**
 * The brand book, replacing brand.fsws.in.
 *
 * That site had fifteen sections; three of them were true. The logo, the
 * palette and the type system are here and the rest is gone, because a guide
 * nobody trusts is worse than no guide: the positioning copy and the scripted
 * phone openers on the old one had already been overtaken by this site, and
 * anyone following both would have written two different companies.
 *
 * Playfair Display and the accents group went the same way, on the evidence
 * that nothing had ever used them. content/brand.ts records why, so the case
 * is on file rather than in someone's memory.
 *
 * It is noindex. This is a working reference for people who make FSWS
 * documents, not a page that should compete with the site in a search result
 * for the company's own name. It stays linked from the footer so it can be
 * found by anyone who needs it.
 */

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Brand",
    description:
      "The FSWS mark, the colour palette and the type system. The working reference for anyone producing FSWS documents.",
    path: "/brand",
  }),
  robots: { index: false, follow: true },
};

export default function BrandPage() {
  return (
    <>
      <PageHero
        eyebrow="Brand"
        title="The mark, the palette, the type"
        lede="What is here is what can be relied on. Everything else that used to sit alongside it has been removed rather than left to rot."
      />

      {/* ══ logo ══════════════════════════════════════════════════ */}
      <Section ground="tint" id="logo">
        <Container>
          <SectionHeader
            eyebrow="01"
            title="The mark"
            lede="One drawing, three renderings. Choose by the ground it sits on, never by preference."
          />

          <ul className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
            {logos.map((logo) => (
              <li key={logo.file}>
                <Panel tone="plain" radius="xl" className="flex h-full flex-col overflow-hidden">
                  <div
                    className={cnGround(logo.ground)}
                  >
                    <Image
                      src={logo.file}
                      alt={`FSWS mark, ${logo.name.toLowerCase()}`}
                      width={112}
                      height={112}
                      className="size-24 lg:size-28"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-bold text-green-900">{logo.name}</h3>
                      <a
                        href={logo.file}
                        download
                        className="rounded-sm font-mono text-xs text-green-600 underline-offset-4 hover:underline"
                      >
                        SVG
                      </a>
                    </div>
                    <p className="mt-2 text-sm text-ink-600">{logo.use}</p>
                  </div>
                </Panel>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6">
            <Panel tone="plain" radius="xl" className="p-6 lg:p-7">
              <Label>Clear space and minimums</Label>
              <p className="mt-4 max-w-[52ch] text-ink-900">{logoRules.clearSpace}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {logoRules.minimums.map((m) => (
                  <div key={m.label} className="border-t border-ink-200 pt-3">
                    <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
                      {m.label}
                    </dt>
                    <dd className="mt-1.5 font-mono text-2xl text-green-900">{m.value}</dd>
                    <dd className="text-xs text-ink-600">{m.unit}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel tone="plain" radius="xl" className="p-6 lg:p-7">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <Label>Do</Label>
                  <ul className="mt-4 space-y-2.5">
                    {logoRules.do.map((rule) => (
                      <li key={rule} className="flex gap-2.5 text-sm text-ink-900">
                        <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-green-600" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label>Do not</Label>
                  <ul className="mt-4 space-y-2.5">
                    {logoRules.dont.map((rule) => (
                      <li key={rule} className="flex gap-2.5 text-sm text-ink-600">
                        <XIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#b42318]" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Panel>
          </div>
        </Container>
      </Section>

      {/* ══ palette ═══════════════════════════════════════════════ */}
      <Section ground="light" id="palette">
        <Container>
          <SectionHeader
            eyebrow="02"
            title="The palette"
            lede="Colour is used for control, status and clarity, never decoration. Broadly six parts neutral to three parts green, with status carrying the rest. Every chip copies its own hex."
          />

          <div className="mt-12 flex flex-col gap-14 lg:mt-16 lg:gap-16">
            {palette.map((group) => (
              <section key={group.title}>
                <div className="flex flex-col gap-3 border-b border-green-600 pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
                  <h3 className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
                    {group.title}
                  </h3>
                  <p className="max-w-[58ch] text-sm text-ink-600 sm:text-right">{group.note}</p>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {group.swatches.map((swatch) => (
                    <li key={`${group.title}-${swatch.name}`}>
                      <Swatch swatch={swatch} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <Panel tone="tint" radius="xl" className="mt-14 max-w-[74ch] p-6">
            <p className="text-sm text-ink-600">
              No bright, neon or lime greens. They read as consumer software and undermine
              the industrial credibility the rest of the system is built on. The forest
              tones above are the whole green range.
            </p>
          </Panel>
        </Container>
      </Section>

      {/* ══ typography ════════════════════════════════════════════ */}
      <Section ground="tint" id="typography">
        <Container>
          <SectionHeader
            eyebrow="03"
            title="The type"
            lede="Two faces. Manrope for what the company says, JetBrains Mono for what it can prove. Type is a control surface here: it is what makes a document read as accurate before a word of it is understood."
          />

          <div className="mt-12 flex flex-col gap-5 lg:mt-16">
            {typefaces.map((face) => (
              <Panel key={face.id} tone="plain" radius="xl" className="p-6 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-12">
                  <div>
                    <Label>{face.role}</Label>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-green-900">
                      {face.name}
                    </h3>
                    <p className="mt-2 font-mono text-xs text-ink-600">{face.weights}</p>
                    <p className="mt-4 max-w-[42ch] text-sm text-ink-600">{face.use}</p>
                  </div>
                  <p
                    className={`self-center text-[1.75rem] leading-[1.15] text-green-900 sm:text-[2.25rem] ${face.id === "mono" ? "font-mono" : "font-sans"}`}
                  >
                    {face.specimen}
                  </p>
                </div>
              </Panel>
            ))}
          </div>

          <div className="mt-10">
            <Label>Hierarchy</Label>
            <dl className="mt-5 border-t border-ink-200">
              {scale.map((step) => (
                <div
                  key={step.label}
                  className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-ink-200 py-4 sm:grid-cols-[11rem_1fr_14rem]"
                >
                  <dt className="text-[0.7rem] font-bold tracking-[0.14em] text-green-600 uppercase">
                    {step.label}
                  </dt>
                  <dd className="font-bold text-green-900">{step.face}</dd>
                  <dd className="col-span-2 font-mono text-xs text-ink-600 sm:col-span-1 sm:text-right">
                    {step.detail}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-[62ch] text-sm text-ink-600">
              Nothing outside these three. Arial, Calibri and Times New Roman in an FSWS
              document say more about the company than the document does.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

/** The plate a mark is shown on. Kept out of the markup above because it is the
 *  one thing that changes per logo and reads better named. */
function cnGround(ground: "light" | "deep") {
  return [
    "flex items-center justify-center rounded-t-[17px] py-14",
    ground === "deep" ? "bg-green-900" : "bg-green-50",
  ].join(" ");
}
