import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ProductFeature } from "@/components/sections/product-feature";
import { productLines, products, productsIn } from "@/content/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "EcoBricks, TerraPots, TerraVita compost and cattle feed. What the collected material becomes, off the ash line and the green line.",
  alternates: { canonical: "/products" },
};

/**
 * Chapter rule. The line name sits on a green hairline with the sentence that
 * defines the line ranged right, which is the same device the routing map uses
 * for its column headings. It divides the page without introducing a second
 * heading scale competing with the page title.
 */
function LineRule({ name, note }: { name: string; note: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-green-600 pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
      <h2 className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
        {name}
      </h2>
      <p className="max-w-[58ch] text-sm text-ink-600 sm:text-right">{note}</p>
    </div>
  );
}

export default function ProductsPage() {
  const [ash, green] = productLines;
  const order = new Map(products.map((p, i) => [p.slug, i + 1]));

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="What the material becomes"
        lede="Two streams do not leave Haridwar as waste at all. Ash is pressed into masonry, green waste is composted. Both are consented processes, and both are why the end use can be named rather than estimated."
      />

      {/* ══ ash line ══════════════════════════════════════════════ */}
      <Section ground="tint">
        <Container>
          <LineRule name={ash.name} note={ash.note} />

          <div className="mt-14 flex flex-col gap-16 lg:mt-20 lg:gap-24">
            {productsIn("ash").map((product, i) => (
              <ProductFeature
                key={product.slug}
                product={product}
                index={order.get(product.slug) ?? i + 1}
                flip={i % 2 === 1}
              />
            ))}
          </div>

          {/* Sits with the ash line because both standards it names are
              masonry standards. */}
          <Panel tone="tint" radius="xl" className="mt-16 max-w-[74ch] p-6 lg:mt-20">
            <p className="text-sm text-ink-600">
              No strength or durability figure is published here. Blocks are tested against
              IS 2185 (Part 1) and IS 12894 as the product class requires, and results for a given
              production lot are available on request. Where a specification needs to be met, tell us
              the requirement and we will confirm against test rather than against a brochure.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-5">
              <Link href="/contact">Request test results</Link>
            </Button>
          </Panel>
        </Container>
      </Section>

      {/* ══ green line ════════════════════════════════════════════ */}
      <Section ground="light">
        <Container>
          <LineRule name={green.name} note={green.note} />

          <div className="mt-14 flex flex-col gap-16 lg:mt-20 lg:gap-24">
            {productsIn("green").map((product, i) => (
              <ProductFeature
                key={product.slug}
                product={product}
                index={order.get(product.slug) ?? i + 1}
                flip={i % 2 === 1}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section ground="deep" className="py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <p className="text-[0.7rem] font-bold tracking-[0.16em] text-green-200 uppercase">
                Supply
              </p>
              <h2 className="mt-4 max-w-[26ch] text-3xl font-extrabold tracking-[-0.025em] text-balance text-white sm:text-4xl">
                Retail and bulk, with recurring delivery where it suits
              </h2>
              <p className="mt-5 max-w-[54ch] text-green-200">
                Tell us quantity, delivery point and frequency. Larger TerraPot runs are
                made to order.
              </p>
            </div>
            <Button asChild size="lg" variant="light">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
