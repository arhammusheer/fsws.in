import type { NextConfig } from "next";

/**
 * Caching and prefetch policy.
 *
 * Every route on this site is prerendered at build time. There is no database,
 * no per-request work and nothing personalised, so the only reason a visitor
 * should ever wait is a byte that has not arrived yet. That makes caching worth
 * being aggressive about in a way it would not be on a dynamic site.
 */
const nextConfig: NextConfig = {
  experimental: {
    /**
     * How long the client router may reuse a page it has already fetched,
     * before going back to the network on a repeat visit.
     *
     * The default for static routes is five minutes, which is tuned for sites
     * whose pages can change between two clicks. Nothing here changes without
     * a deploy, and a deploy invalidates the whole client cache anyway, so an
     * hour is both safe and the difference between a back button that is
     * instant and one that refetches.
     */
    staleTimes: { static: 3600, dynamic: 60 },
  },

  async headers() {
    return [
      {
        /**
         * Photography, footage and logos. A year, immutable, because none of
         * these is generated or fingerprinted: they are the same bytes under
         * the same name until somebody replaces them.
         *
         * THE CONDITION THAT COMES WITH THIS: a replaced file must be given a
         * NEW NAME. Overwriting hero-1920.mp4 in place will leave the old one
         * in caches for up to a year, and `immutable` means browsers will not
         * even ask. This is the standard trade for asset caching and it is only
         * a trap if it is not written down, so it is written down here.
         */
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        /**
         * The brand marks are the same kind of file but a different contract:
         * they are offered as downloads on /brand, and if the mark is ever
         * redrawn people need the new one without waiting out a year. A week,
         * with a day of stale-while-revalidate, so it is still served from
         * cache instantly and refreshed behind the visitor.
         */
        source: "/brand/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Read once at install and then rarely. The default was
        // must-revalidate, which made a request on every page load for a file
        // that changes about never.
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Crawler files. Long enough to stop the hits, short enough that a
        // sitemap change is picked up the same day.
        source: "/:file(robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
