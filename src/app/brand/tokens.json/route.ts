import { logos, palette, typefaces } from "@/content/brand";
import { registrations, consent } from "@/content/credentials";
import { contact, site } from "@/content/site";

/**
 * The brand, as data, at /brand/tokens.json.
 *
 * The page at /brand is for a person reading it. This is the same thing for
 * everything that is not: a design tool importing the palette, a script
 * generating a template, an AI agent asked to draft an FSWS document and
 * needing to know what FSWS actually looks like and is called. Those consumers
 * should not be scraping a page, and they should not be told the values by
 * someone from memory, which is how the wrong green ends up in a deck.
 *
 * It is BUILT FROM content/brand.ts, not written alongside it. A hand-kept
 * manifest is a second source of truth, and the second source is always the one
 * that is out of date. Change a hex in the content file and this changes with
 * it, or it does not change at all.
 *
 * The token groups follow the W3C Design Tokens format, so Style Dictionary,
 * Figma's variable importers and the rest can read it without a shim. Anything
 * that is not a design token, meaning the logo files and the entity's
 * registered identity, lives under $extensions, which is the spec's own escape
 * hatch for exactly this.
 *
 * Statically rendered: it is a file that happens to be generated, and it should
 * cost a CDN hit rather than a function invocation.
 */
export const dynamic = "force-static";

/** Turns "Brand core" into "brand-core", and "FSWS Green" into "fsws-green". */
const key = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function GET() {
  const color: Record<string, Record<string, unknown>> = {};
  for (const group of palette) {
    color[key(group.title)] = Object.fromEntries(
      group.swatches.map((s) => [
        key(s.name),
        { $value: s.hex, $description: s.use },
      ]),
    );
  }

  const manifest = {
    $description:
      `Design tokens for ${site.legalName}. Canonical source: ${site.url}/brand. ` +
      "Colour and type follow the W3C Design Tokens format; everything else is under $extensions.",
    color: { $type: "color", ...color },
    fontFamily: {
      $type: "fontFamily",
      sans: {
        $value: ["Manrope", "system-ui", "sans-serif"],
        $description: typefaces.find((t) => t.id === "manrope")?.use,
      },
      mono: {
        $value: ["JetBrains Mono", "ui-monospace", "monospace"],
        $description: typefaces.find((t) => t.id === "mono")?.use,
      },
    },
    $extensions: {
      "in.fsws.brand": {
        guide: `${site.url}/brand`,
        // Only two faces. A third was removed for never having been used;
        // anything reading this should not go looking for a display serif.
        typefaces: typefaces.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          weights: t.weights,
          use: t.use,
        })),
        logo: logos.map((l) => ({
          name: l.name,
          url: `${site.url}${l.file}`,
          ground: l.ground,
          use: l.use,
        })),
        trademark: {
          status: "Registered",
          notice:
            `The FSWS mark is a registered trademark of ${site.legalName}. ` +
            "It is published here so that partners, clients and contractors can " +
            "reproduce it correctly, and for no other purpose. It may be used to " +
            "refer to the company or to identify it as a supplier or customer. It " +
            "may not be altered, incorporated into another mark, or used in a way " +
            "that implies endorsement, partnership or certification that does not " +
            "exist. Reproduce it from these files, unmodified.",
          contact: contact.email,
        },
        entity: {
          legalName: site.legalName,
          shortName: site.shortName,
          founded: site.founded,
          url: site.url,
          email: contact.email,
          telephone: contact.phone,
          address: contact.address,
          registrations: Object.fromEntries(
            registrations.map((r) => [key(r.label), r.value]),
          ),
          consent: {
            authority: consent.authority,
            instrument: consent.instrument,
            cafId: consent.cafId,
            applicationNo: consent.applicationNo,
            validTo: consent.validTo,
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
