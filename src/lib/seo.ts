import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * Per-route metadata, built in one place.
 *
 * Next merges a route's `metadata` over the root's field by field, and that is
 * exactly what caught this site out: a route that sets `title` and
 * `description` but no `openGraph` block inherits the root's openGraph
 * untouched. Every interior page was therefore shipping the homepage's og:title
 * and og:description, and, worse, og:url as https://fsws.in. Sharing the
 * credentials page in a message showed the homepage's blurb, and any crawler
 * reading og:url was told it was looking at the homepage.
 *
 * The fix is not to remember to write the block each time. It is to make one
 * function that cannot produce a half-filled card, and call it from every
 * route.
 *
 * The image is deliberately absent here. Each route has its own
 * opengraph-image.jpg and twitter-image.jpg beside its page, and Next resolves
 * those to absolute URLs with dimensions and a type. Setting `images` in this
 * object would override the file convention and we would be back to hand
 * maintaining paths.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** The page's own title. The root's template appends the site name. */
  title: string;
  description: string;
  /** Route path with a leading slash. */
  path: string;
}): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      // Titles in openGraph do not go through the root's template, so the site
      // name is appended here or the card reads as a fragment out of context.
      title: `${title} | ${site.shortName}`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.shortName}`,
      description,
    },
  };
}
