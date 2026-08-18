import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { streams } from "@/content/streams";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // /brand is deliberately absent. It is noindex, and listing a noindex URL in
  // a sitemap asks a crawler to fetch a page and then tells it to forget what
  // it found, which is how a site accumulates coverage warnings.
  const routes = [
    { path: "", priority: 1 },
    { path: "/materials", priority: 0.9 },
    { path: "/credentials", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/products", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
  ];

  return [
    ...routes.map((r) => ({
      url: `${site.url}${r.path}`,
      lastModified: now,
      priority: r.priority,
    })),
    ...streams.map((s) => ({
      url: `${site.url}/materials/${s.slug}`,
      lastModified: now,
      priority: 0.5,
    })),
  ];
}
