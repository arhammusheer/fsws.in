import Image from "next/image";

import { Chip } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import type { Product } from "@/content/products";

/**
 * One product, given a full row rather than a card.
 *
 * The range is four items. At that count a grid of equal cards is the wrong
 * instrument: it makes four products look like a catalogue page of forty, and
 * it caps every photograph at thumbnail size while squeezing the specs into a
 * box. A row per product gives each one a plate you can actually read the
 * material off, and room for the spec table to be a table.
 *
 * Rows alternate which side the plate sits on. DOM order is content then image
 * so the heading is read first; the swap is done with column starts on lg, and
 * with `order` below it, where the plate leads because an image is the better
 * hook once the layout is a single column.
 *
 * Both columns are top aligned and both are pinned to `row-start-1`. The row
 * start is not decoration: DOM order is content then image, so on a flipped row
 * the content takes columns 6 to 12 and the grid cursor is already past column
 * 1 when the image arrives asking for it. Auto-placement will not go backwards,
 * so it drops the image onto a second row and the pair falls out of line while
 * every unflipped row looks fine. Naming the row for both is the fix.
 *
 * The plate is portrait. That is driven by the photography rather than by
 * taste: the TerraVita pack shot is 960x1280 and would be beheaded by a
 * landscape crop, while the brick stack, the planters and the pellet macro all
 * survive losing their sides. One ratio for all four keeps the run even.
 *
 * Only the first image is used. Each product has a second, but they range from
 * 2.1:1 to portrait and one is 370px wide, so there is no second frame that
 * holds all four without a bad crop. Better one considered plate than a
 * strip that fails on a quarter of the range.
 */
export function ProductFeature({
  product,
  index,
  flip = false,
}: {
  product: Product;
  /** Position in the whole range, not within the line. */
  index: number;
  flip?: boolean;
}) {
  return (
    <article className="grid items-start gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-x-12">
      <div
        className={cn(
          "order-2 lg:order-none lg:col-span-7 lg:row-start-1",
          flip ? "lg:col-start-6" : "lg:col-start-1",
        )}
      >
        <span className="block font-mono text-xs text-green-600">
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.025em] text-green-900 sm:text-4xl">
          {product.name}
        </h3>
        <Chip className="mt-4">{product.madeFrom}</Chip>
        <p className="mt-5 max-w-[54ch] text-ink-600">{product.summary}</p>

        <dl className="mt-8 border-t border-ink-200">
          {product.specs.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-ink-200 py-3 sm:grid-cols-[9rem_1fr]"
            >
              <dt className="text-[0.7rem] font-bold tracking-[0.14em] text-green-600 uppercase">
                {spec.label}
              </dt>
              <dd className="font-mono text-xs leading-relaxed text-ink-900">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        className={cn(
          "order-1 lg:order-none lg:col-span-4 lg:row-start-1",
          flip ? "lg:col-start-1" : "lg:col-start-9",
        )}
      >
        <div className="relative mx-auto aspect-4/5 max-w-sm overflow-hidden rounded-2xl border border-ink-200 bg-green-50 lg:max-w-none">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 24rem, 92vw"
            className="object-cover"
          />
        </div>
      </div>
    </article>
  );
}
