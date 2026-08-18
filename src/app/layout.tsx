import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { RoutePrefetch } from "@/components/layout/route-prefetch";
import { site, contact } from "@/content/site";
import { registrations } from "@/content/credentials";
import { HEADER_OFFSET } from "@/lib/layout";

/* next/font downloads and self-hosts at build time, so there is no runtime
   request to Google and no layout shift. Weights are pinned to the ones the
   design actually uses: anything else ships bytes nobody sees. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Waste management, evidenced`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Waste management, evidenced`,
    description: site.description,
  },
  // Every route sets its own openGraph through lib/seo.ts. This block is the
  // homepage's card and the fallback for anything that does not.
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Waste management, evidenced`,
    description: site.description,
  },
  keywords: [
    "waste management Haridwar",
    "industrial waste Uttarakhand",
    "end-use certificate",
    "UKPCB consent",
    "waste segregation SIDCUL",
    "fly ash bricks",
    "compost Haridwar",
  ],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "Waste management",
  // Stops iOS Safari turning the registration numbers into phone links, which
  // it does to any long digit string and which makes CIN and GSTIN tappable
  // nonsense.
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  // The icon files themselves live in this directory and Next emits the link
  // tags for them from its file conventions. Only the manifest has to be
  // pointed at, since its route is generated rather than a file.
  manifest: "/manifest.webmanifest",
  applicationName: site.name,
  appleWebApp: { capable: true, title: site.shortName, statusBarStyle: "default" },
};

/**
 * theme-color drives the browser chrome around the page: the address bar on
 * Android, the title bar of an installed window. FSWS Green, matching the
 * manifest, so the frame belongs to the site rather than sitting outside it.
 */
export const viewport: Viewport = {
  themeColor: "#175c25",
};

/** JSON-LD carrying the real registration numbers, so the entity is
 *  machine-identifiable rather than just another company page. */
function organizationJsonLd() {
  const cin = registrations.find((r) => r.label === "CIN")?.value;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    foundingDate: site.founded,
    identifier: cin,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "SIDCUL",
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      /* globals.css sets `scroll-behavior: smooth` on this element, for in-page
         anchors. Declaring it here as well tells the router the smoothness is
         deliberate, so it suppresses it on route changes: without this a
         navigation animates the scroll back to the top instead of landing
         there, and the new page arrives mid-scroll. */
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        {/* Everything the transition clips has to sit inside it, header and
            footer included, or the page opens out from the corner with a bar
            already painted across the top. */}
        {/* Warms the client router cache with every route once idle. */}
        <RoutePrefetch />
        <PageTransition>
          <Header />
          {/* clears the fixed header; the homepage cancels this with a
              negative margin so its first screen starts at the true top */}
          <main id="main" className={`flex-1 ${HEADER_OFFSET}`}>
            {children}
          </main>
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
