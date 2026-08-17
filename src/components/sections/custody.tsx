import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Chain of custody: six points between collection and certification.
 *
 * Drawn as one rail with six stations, because that is what a chain is. The
 * first version of this section was a two-by-three grid of tinted cards, which
 * failed for a specific reason rather than a matter of taste: reading order
 * zigzagged across and then down, so the sequence had to be reconstructed from
 * the numerals, and nothing joined one step to the next. Six solid green
 * numeral chips also ended up the loudest thing in the section while carrying
 * the least information in it.
 *
 * The node and hairline vocabulary is the routing map's, so the two diagrams
 * read as the same family. They stay distinguishable by structure: the routing
 * map is a table of streams, this is a single line of travel. The last node is
 * filled rather than hollow, which is the whole argument of the section: the
 * chain terminates in a document.
 *
 * The rail is drawn per row rather than as one element over the list, because
 * row heights vary with the text. Each segment overhangs its row by the row
 * padding (py-5, so 1.25rem) to bridge the gap to its neighbour, and the first
 * and last are cut back to their node so the line starts and stops on a
 * station instead of running off into the margin.
 */

const steps = [
  {
    t: "Weighed at source",
    d: "Weighed and signed off at the collection site before loading.",
  },
  {
    t: "Transported",
    d: "Moved against a delivery document, with an e-way bill where the consignment value requires one.",
  },
  {
    t: "Re-weighed on arrival",
    d: "Weighed again at Haridwar. Any variance against the source weight is recorded.",
  },
  {
    t: "Segregated",
    d: "Sorted to stream. Contaminants, moisture and foreign material are recorded by weight.",
  },
  {
    t: "Dispatched",
    d: "Sent to the named mill, recycler or FSWS production line against invoice and weighment.",
  },
  {
    t: "Certificate issued",
    d: "By whichever party performed the recovery, referenced to the weights above.",
  },
];

export function Custody() {
  return (
    <Section ground="light">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16">
          {/* Sticky so the heading travels with the rail instead of leaving a
              well of empty ground beside the lower stations. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow="Record"
              title="Chain of custody"
              lede="Six points between collection and certification. Weights are reported against four routes separately, reused, recycled, recovered and disposed, rather than as a single diversion figure."
            />
            <Button asChild variant="link" className="mt-6">
              <Link href="/materials">
                Every stream and where it ends up
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <ol className="lg:pt-1">
            {steps.map((step, i) => {
              const first = i === 0;
              const last = i === steps.length - 1;

              return (
                <li
                  key={step.t}
                  className="grid grid-cols-[0.75rem_1fr] gap-x-5 py-5 sm:grid-cols-[0.75rem_11rem_1fr] sm:gap-x-8"
                >
                  <span aria-hidden="true" className="relative block">
                    <span
                      className={cn(
                        "absolute left-1/2 w-px -translate-x-1/2 bg-green-200",
                        first && "top-2 -bottom-5",
                        last && "-top-5 h-7",
                        !first && !last && "-top-5 -bottom-5",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-[3px] left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-green-600",
                        last ? "bg-green-600" : "bg-white",
                      )}
                    />
                  </span>

                  <div>
                    <span className="block font-mono text-xs text-green-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1.5 font-bold text-green-900">{step.t}</p>
                  </div>

                  <p className="mt-2 max-w-[52ch] text-sm text-ink-600 sm:mt-0 sm:pt-[1.6rem]">
                    {step.d}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
