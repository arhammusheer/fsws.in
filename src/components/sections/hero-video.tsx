"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";

/**
 * Hero background: a locked-off top-down aerial of a road through autumn
 * woodland. It behaves as a background rather than a subject, which is the
 * point: the camera does not drift, movement is confined to the road band, and
 * the palette is already deep green and ochre.
 *
 * The poster renders on the server and is the LCP element. The video attaches
 * only once the client confirms it is wanted, so the largest paint stays an
 * image and there is no hydration mismatch.
 *
 * Not loaded when: the visitor prefers reduced motion, the viewport is under
 * 768px where a full-bleed video costs mobile data for something mostly hidden
 * behind the overlay, the browser reports Save-Data, or the connection is
 * reported as 2g or 3g. The footage is 2 to 3.7 MB and the still says the same
 * thing; on a link that slow the video would arrive after the reader had gone.
 *
 * The video carries NO `poster`. It is layered over the Image above, which is
 * the same frame, and a video element with no frames yet is transparent, so
 * the still shows through and there is nothing to hand over. Setting `poster`
 * as well made the browser fetch that JPEG a second time, raw and unoptimised:
 * 352 kB through next/image plus 356 kB for the poster attribute, 708 kB for
 * one still, and the duplicate landed hardest on exactly the connections it
 * was supposed to be helping.
 *
 * The overlay is a flat fill, never a gradient scrim. Its opacity is measured,
 * not chosen by eye: the hero is about 2.06:1 against 16:9 source, so
 * object-cover crops top and bottom and the road band, the brightest thing in
 * frame, sits directly behind the headline. Sampling 831,168 pixels from that
 * exact crop, 0.76 gives a worst-case white 7.63:1 and Mist 5.02:1, both
 * clearing WCAG AA for body text; at 0.72 the Mist lede fell to 4.47:1.
 * Re-measure if the footage changes. See public/assets/hero/SOURCE.md.
 */

const OVERLAY_ALPHA = 0.76;

const MOTION_QUERY =
  "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  if (!window.matchMedia(MOTION_QUERY).matches) return false;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return false;
  // effectiveType is a measurement of the link, not a label for the radio, so
  // it catches a stalled wifi as well as a slow cell.
  if (connection?.effectiveType && /(^|-)[23]g$/.test(connection.effectiveType)) {
    return false;
  }
  return true;
}

function getServerSnapshot() {
  return false;
}

export function HeroVideo() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
      <Image
        src="/assets/hero/hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {enabled ? (
        // Muted autoplay, which every current browser permits without a
        // gesture. Headless Chrome blocks autoplay regardless of `muted`, so a
        // headless screenshot cannot confirm playback: a plain HTML
        // <video autoplay muted> behaves identically there. Confirm in a real
        // browser, not in CI.
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        >
          <source
            src="/assets/hero/hero-1920.mp4"
            type="video/mp4"
            media="(min-width: 1024px)"
          />
          <source src="/assets/hero/hero-1280.mp4" type="video/mp4" />
        </video>
      ) : null}

      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgb(12 46 18 / ${OVERLAY_ALPHA})` }}
      />
    </div>
  );
}
