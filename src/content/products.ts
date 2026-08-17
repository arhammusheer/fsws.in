import { z } from "zod";
import { productSchema, validate } from "./schema";

/**
 * Products exist on this site as evidence that collected material gets used,
 * not as a shop. Each one names what it is made from.
 *
 * These four are the whole range. Nothing else may be presented as a product
 * anywhere on the site: the services and the recycling routes are described in
 * their own sections and are not products. Two earlier entries, SolidBench and
 * AshWall, were removed along with their photography.
 *
 * Ordered ash line first, then green line, which is the order /products reads
 * in. The homepage takes the first three, so that slice stays one short of the
 * full range on purpose.
 *
 * Specs are physical descriptions and process facts only. No strength or
 * durability figure appears here: none has been published from an accredited
 * test, and the brand prohibits unaudited claims. Where a standard is named it
 * is named as the standard the product is tested against, not as a pass.
 */
export const products = validate(
  z.array(productSchema).min(1),
  [
    {
      slug: "ecobricks",
      name: "EcoBricks",
      category: "ash",
      madeFrom: "Industrial ash",
      summary:
        "Masonry units pressed from boiler ash and an FSWS binder. The line is cold pressed and ambient cured, so no firing fuel is consumed.",
      specs: [
        { label: "Made from", value: "Boiler and fly ash" },
        { label: "Process", value: "Cold pressed, ambient cured, no kiln" },
        { label: "Tested against", value: "IS 2185 (Part 1), IS 12894" },
      ],
      images: [
        "/assets/products/ecobricks-2.png",
        "/assets/products/ecobricks-3.png",
      ],
    },
    {
      slug: "terrapots",
      name: "TerraPots",
      category: "ash",
      madeFrom: "Industrial ash",
      summary:
        "Planters pressed from the same ash and binder mix as the masonry units, in a range of shapes and sizes for gardens and landscaping.",
      specs: [
        { label: "Made from", value: "Boiler and fly ash" },
        { label: "Process", value: "Cold pressed, ambient cured" },
        { label: "Sizes", value: "Multiple, made to order" },
      ],
      images: [
        "/assets/products/terrapot-1.png",
        "/assets/products/terrapot-3.png",
      ],
    },
    {
      slug: "terravita",
      name: "TerraVita",
      category: "green",
      madeFrom: "Horticulture and green waste",
      summary:
        "Compost produced from green waste, dry leaves, cow dung and canteen waste using a proprietary bacterial culture. Composting is a consented process at the Haridwar facility.",
      specs: [
        {
          label: "Made from",
          value: "Green waste, dry leaves, cow dung, canteen waste",
        },
        { label: "Process", value: "Windrow composting, proprietary culture" },
        { label: "Consented capacity", value: "600 MT per month" },
      ],
      images: [
        "/assets/compost/terravita-1.jpg",
        "/assets/compost/compost-site.jpg",
      ],
    },
    {
      slug: "cattle-feed",
      name: "Cattle feed",
      category: "green",
      madeFrom: "Organic by-products",
      summary:
        "Feed pelletised from organic by-products, formulated for livestock nutrition.",
      specs: [
        { label: "Made from", value: "Organic by-products" },
        { label: "Process", value: "Blended and pelletised" },
        { label: "Supply", value: "Retail and bulk" },
      ],
      images: [
        "/assets/compost/cattle-feed-pellet.jpeg",
        "/assets/compost/pellet-machine.jpg",
      ],
    },
  ],
  "content/products.ts",
);

export type Product = (typeof products)[number];
export type ProductCategory = Product["category"];

/**
 * The two lines, with the sentence that explains what makes them one line.
 * Used as the chapter rules on /products.
 */
export const productLines = [
  {
    id: "ash" as const,
    name: "Ash products",
    note: "Pressed from boiler and fly ash with an FSWS binder. Cold pressed and ambient cured, so no firing fuel is consumed.",
  },
  {
    id: "green" as const,
    name: "Green products",
    note: "Made from green waste and organic by-products. Composting is a consented process at the Haridwar facility.",
  },
];

export const productsIn = (category: ProductCategory) =>
  products.filter((p) => p.category === category);

export const productBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
