/**
 * Site-level constants: identity, navigation, contact.
 * Registration numbers live in credentials.ts and are imported where needed
 * rather than duplicated.
 */

export const site = {
  name: "FirstSources Waste Solutions",
  shortName: "FSWS",
  legalName: "FirstSources Waste Solutions Private Limited",
  url: "https://fsws.in",
  /** Used as the default meta description and in the JSON-LD. */
  description:
    "Waste management for industrial and commercial sites in Uttarakhand. A named end use for every stream, with the certificate that evidences it.",
  locality: "Haridwar",
  region: "Uttarakhand",
  country: "IN",
  founded: "2019",
} as const;

export const contact = {
  email: "help@fsws.in",
  phone: "+91 90688 55443",
  phoneHref: "tel:+919068855443",
  altPhone: "+91 74095 16090",
  altPhoneHref: "tel:+917409516090",
  address: "SIDCUL, Haridwar, Uttarakhand",
} as const;

export const nav = [
  { label: "Materials", href: "/materials" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Credentials", href: "/credentials" },
  { label: "About", href: "/about" },
] as const;

export const cta = {
  primary: { label: "Talk to us", href: "/contact" },
  secondary: { label: "View credentials", href: "/credentials" },
} as const;
