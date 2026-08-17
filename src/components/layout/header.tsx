"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { nav, cta, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { HEADER_SOLID, HEADER_TALL } from "@/lib/layout";

/**
 * Smart topbar.
 *
 * Over the hero it is transparent with the reversed mark and white links, so
 * the footage runs edge to edge behind it. Once the first screen has scrolled
 * past it becomes the solid white bar. Both states cross-fade rather than
 * switching, and the mark is two stacked images fading between each other
 * rather than a `src` swap, which would flash.
 *
 * It is fixed, not sticky, because a transparent bar has to sit over the hero
 * rather than reserve space above it. That means every page needs to clear it:
 * `main` in layout.tsx carries the top padding, and the homepage cancels that
 * with a negative margin so its first screen starts at the true top.
 *
 * The flip is driven by an IntersectionObserver on a sentinel at the end of the
 * first screen, not a scroll listener: no rAF throttling, no work on frames
 * where nothing changed. The observer reports when the sentinel crosses the
 * bar; which state that means is decided from its position, not from
 * `isIntersecting`, for the reason given at the callback.
 *
 * Over the hero the bar carries a progressive scrim: a blur plus a faint tint,
 * both faded out downward by a mask so there is no hard edge where it stops.
 * Without it, hero copy scrolling under transparent nav links produced text on
 * text. The gradient here is a MASK, not a decorative fill, which is the only
 * reason it is allowed past the no-gradients rule; scripts/check-design.mjs
 * permits it in this file alone.
 *
 * Routes without a hero start solid, so there is no frame of white-on-white
 * before hydration settles. That is why the route list is explicit rather than
 * inferred from whether the sentinel happens to exist.
 */
const HERO_ROUTES = ["/"];

export function Header() {
  const pathname = usePathname();
  const overHero = HERO_ROUTES.includes(pathname);
  const [scrolledPast, setScrolledPast] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!overHero) return;
    const sentinel = document.querySelector("[data-hero-sentinel]");
    if (!sentinel) return;

    // Flip when the sentinel crosses the underside of the bar, not the top of
    // the viewport, so the change lands exactly as the hero leaves.
    const offset = headerRef.current?.offsetHeight ?? 64;

    // Settle immediately from where the sentinel actually is. The observer's
    // first callback is asynchronous, and on a page restored to a scroll
    // position deep down it is the only callback that will ever arrive, since
    // the intersection state never changes from there.
    const at = sentinel.getBoundingClientRect().top;
    setScrolledPast((current) =>
      current === at <= offset ? current : at <= offset,
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Which SIDE the sentinel is out on, not merely that it is out.
        // `!isIntersecting` is true both above the bar and below the fold, and
        // those are opposite situations. Once the first screen grew taller than
        // the viewport, the sentinel started below it, so at rest the header
        // read "scrolled past the hero" and painted itself white over the
        // video, then flipped transparent as the sentinel scrolled into view,
        // then white again as it left. Comparing the sentinel's top against the
        // underside of the bar answers the question that was actually being
        // asked.
        const past = entry.boundingClientRect.top <= offset;
        // only write when the value changes, so a sentinel that jitters on a
        // dvh recalculation cannot thrash the header between states
        setScrolledPast((current) => (current === past ? current : past));
      },
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [overHero, pathname]);

  const solid = !overHero || scrolledPast;

  return (
    <header
      ref={headerRef}
      data-solid={solid}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-out",
        solid
          ? "border-ink-200 bg-white/90 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      {/* Extends past the bar's own height so the fade completes below it
          rather than cutting off at the border. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[190%] backdrop-blur-[6px] transition-opacity duration-300",
          solid ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundColor: "rgb(12 46 18 / 0.34)",
          maskImage:
            "linear-gradient(to bottom, rgb(0 0 0) 0%, rgb(0 0 0) 42%, rgb(0 0 0 / 0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgb(0 0 0) 0%, rgb(0 0 0) 42%, rgb(0 0 0 / 0) 100%)",
        }}
      />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-7xl items-center gap-6 px-5 transition-[height] duration-300 ease-out sm:px-6 lg:px-8",
          solid ? HEADER_SOLID : HEADER_TALL,
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg"
          aria-label={`${site.name}, home`}
        >
          {/* 40px is the floor: below roughly 36 the three arcs, the ridge and
              the leaves in the mark merge into a blot. */}
          {/* larger at rest, shrinking to the compact size once scrolled */}
          <span
            className={cn(
              "relative block shrink-0 transition-[width,height] duration-300 ease-out",
              solid ? "size-8 lg:size-9" : "size-11 lg:size-13",
            )}
          >
            <Image
              src="/brand/fsws-green.svg"
              alt=""
              width={40}
              height={40}
              priority
              className={cn(
                "absolute inset-0 size-full transition-opacity duration-300",
                solid ? "opacity-100" : "opacity-0",
              )}
            />
            <Image
              src="/brand/fsws-white.svg"
              alt=""
              width={40}
              height={40}
              priority
              className={cn(
                "absolute inset-0 size-full transition-opacity duration-300",
                solid ? "opacity-0" : "opacity-100",
              )}
            />
          </span>
          <span
            className={cn(
              // The mark scales between states; the wordmark does not. Growing
              // the text too made the lockup top-heavy and crowded the nav.
              "text-[0.88rem] leading-[1.15] font-extrabold tracking-[-0.015em] transition-colors duration-300",
              solid ? "text-green-900" : "text-white",
            )}
          >
            FirstSources
            <span
              className={cn(
                "block font-medium transition-colors duration-300",
                solid ? "text-ink-600" : "text-green-200",
              )}
            >
              Waste Solutions
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors duration-300",
                    solid
                      ? "text-ink-600 hover:bg-green-50 hover:text-green-700"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden lg:ml-4 lg:block">
          <Button asChild size="sm" variant={solid ? "primary" : "light"}>
            <Link href={cta.primary.href}>{cta.primary.label}</Link>
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <MobileNav solid={solid} />
        </div>
      </div>
    </header>
  );
}
