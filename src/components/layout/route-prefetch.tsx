"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { streams } from "@/content/streams";

/**
 * Pull the whole site into the client router cache once the page is idle.
 *
 * Next's Link already prefetches, but only what is linked from wherever you
 * happen to be standing, and only once it scrolls into view. That leaves the
 * long way round slow: a reader on a stream page who jumps to Credentials via
 * the menu waits for a payload that could have arrived while they were reading.
 * This site is sixteen prerendered routes with no database behind them, so
 * there is no reason not to have all of them in hand.
 *
 * It is deliberately unhurried about it:
 *
 *   requestIdleCallback   never competes with the first paint, the hero video,
 *                         or anything the reader is actually waiting for
 *   one route per tick    a burst of sixteen parallel requests would contend
 *                         with the video for bandwidth on the one page where
 *                         that matters
 *   current route first   dropped from the list, since it is already here
 *
 * IT STANDS DOWN when the visitor has said it should. Save-Data is an explicit
 * request not to spend bytes on their behalf, and 2g/slow-2g means the
 * bandwidth this borrows is bandwidth the page itself needs. Speculative
 * loading is a luxury and it should behave like one.
 *
 * The payloads are RSC flight data, not full pages, and they are already
 * built: this costs a handful of small static files from the edge.
 */
const ROUTES = [
  "/",
  "/materials",
  "/services",
  "/products",
  "/credentials",
  "/about",
  "/contact",
  "/brand",
  ...streams.map((s) => `/materials/${s.slug}`),
];

type Connection = {
  saveData?: boolean;
  effectiveType?: string;
};

export function RoutePrefetch() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: Connection };
    const conn = nav.connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

    const queue = ROUTES.filter((r) => r !== pathname);
    let cancelled = false;

    // requestIdleCallback is unimplemented in Safari; there the timeout is the
    // whole mechanism rather than a fallback, so it is set long enough to be
    // clear of the load event.
    const idle: (cb: () => void) => number =
      "requestIdleCallback" in window
        ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => window.setTimeout(cb, 1200);

    let handle = idle(function step() {
      if (cancelled) return;
      const next = queue.shift();
      if (!next) return;
      router.prefetch(next);
      handle = idle(step);
    });

    // Whichever scheduler was used, its canceller is captured here rather than
    // re-tested on unmount: narrowing `window` by a feature test tells the
    // compiler the other branch is unreachable, which it is not.
    const cancel =
      "requestIdleCallback" in window
        ? (id: number) => window.cancelIdleCallback(id)
        : (id: number) => window.clearTimeout(id);

    return () => {
      cancelled = true;
      cancel(handle);
    };
  }, [router, pathname]);

  return null;
}
