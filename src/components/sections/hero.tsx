import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { HeroVideo } from "@/components/sections/hero-video";
import { Container, Label, Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { consent } from "@/content/credentials";
import { cta } from "@/content/site";

/**
 * A single column of type over the footage.
 *
 * The consent detail used to sit in a panel on the right. That was there to
 * stop the hero reading as thin while it was a short band on a flat ground.
 * Now that the first screen is full height and the footage carries the right
 * side, the panel competed with it rather than filling a gap. The same detail
 * is one click away on /credentials, and the registration strip immediately
 * below already puts the numbers on the opening screen.
 */
export function Hero() {
  return (
    <Section
      ground="deep"
      flush
      /* On a phone the hero takes the whole first screen on its own, so the
         registration strip starts below the fold and is met on the first
         scroll. Sharing the screen with it there meant five label and value
         pairs wrapping into a block several lines deep, which ate the opening
         view and read as a table of small print under the headline.

         From sm the strip is a single line again, so the two go back to
         sharing: min-h-0 hands height control to the wrapper in page.tsx and
         flex-1 lets the hero absorb whatever is left after the strip.

         The top padding clears the fixed header; the rest is a floor for
         viewports short enough that content, not the viewport, sets the
         height. */
      className="flex min-h-[100dvh] flex-1 items-center pt-24 pb-14 sm:min-h-0 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
    >
      <HeroVideo />
      <Container>
        <div className="max-w-4xl">
          <Label>Consented and auditable</Label>
          <h1 className="mt-5 text-[2.5rem] leading-[1.0] font-extrabold tracking-[-0.032em] text-balance text-white sm:text-[3.25rem] lg:text-[4rem]">
            Waste management that survives an audit.
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-pretty text-green-200 lg:text-xl">
            A consolidated consent from the {consent.authority}, valid to{" "}
            {consent.validTo}. A named end use for every stream, and the
            certificate that evidences it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="light">
              <Link href={cta.primary.href}>
                {cta.primary.label}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghostLight">
              <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
