import { z } from "zod";
import { capacitySchema, credentialSchema, validate } from "./schema";

/**
 * Registration and consent detail.
 *
 * Every value here is transcribed from a document that can be produced on
 * request: the certificate of incorporation, the GST registration, the Udyam
 * registration, and the Uttarakhand Pollution Control Board Consolidated
 * Consent to Operate and Authorisation dated 24 April 2025.
 *
 * This is the only module permitted to state a capacity figure. The previous
 * site published "5,000+ tons diverted", "4000+ bricks per day" and
 * "500,000+ kg transformed", none of which had a published basis. Consented
 * capacities are stronger and checkable.
 */

export const registrations = validate(
  z.array(credentialSchema).min(1),
  [
    {
      label: "Registered name",
      value: "FirstSources Waste Solutions Private Limited",
    },
    { label: "CIN", value: "U37100UR2019PTC010043" },
    { label: "GSTIN", value: "05AADCF8128L1ZG" },
    { label: "Udyam registration", value: "UDYAM-UK-06-0004657" },
    {
      label: "Facility",
      value: "Khasra 767 to 769, Salempur Mehdood, Haridwar, Uttarakhand",
    },
  ],
  "content/credentials.ts:registrations",
);

export const consent = {
  authority: "Uttarakhand Pollution Control Board",
  office: "Regional Office, Roorkee",
  instrument: "Consolidated Consent to Operate and Authorisation",
  statutes: [
    "Water (Prevention and Control of Pollution) Act, 1974",
    "Air (Prevention and Control of Pollution) Act, 1981",
    "Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016",
  ],
  cafId: "23387",
  applicationNo: "2652160",
  granted: "24 April 2025",
  validTo: "31 March 2030",
} as const;

/**
 * Authorised capacities, from the product schedule on page 1 of the consent.
 *
 * Flagged for the team: clause 5 on page 2 of the same document reads "This CCA
 * is valid for Composting, Compressing, Sun Drying & Packaging Process only",
 * which does not name brick manufacture even though the schedule does. Until
 * that is reconciled with UKPCB, publishing the fly ash brick capacity makes
 * the discrepancy publicly checkable. `published: false` keeps it out of the
 * rendered page while leaving the fact recorded here.
 */
export const capacities = validate(
  z.array(capacitySchema.extend({ published: z.boolean() })).min(1),
  [
    {
      process: "Composting",
      quantity: "600 MT",
      period: "per month",
      published: true,
    },
    {
      process: "Compacting and grinding of plastic waste",
      quantity: "100 MT",
      period: "per month",
      published: true,
    },
    {
      process: "Fly ash bricks",
      quantity: "300,000 units",
      period: "per month",
      published: false,
    },
  ],
  "content/credentials.ts:capacities",
);

/** Only capacities cleared for publication reach the page. */
export const publishedCapacities = capacities.filter((c) => c.published);

/** Held per consignment and available for inspection. */
export const records = [
  "Weighment slips from the collection site and from Haridwar",
  "Delivery documents and e-way bills",
  "Inward receipt and segregation record",
  "Dispatch invoice and weighment to the processor",
  "Processor acknowledgement",
  "The certificate issued, and its covering reference",
] as const;

/**
 * Licences FSWS does not hold. Stated plainly because the alternative is a
 * client discovering it during due diligence. Clause 11 of the consent requires
 * the plastic registration to be obtained.
 */
export const notHeld = [
  {
    activity: "Plastic waste recycling",
    note: "Requires registration under the Plastic Waste Management Rules, 2016. Recycling is performed by a registered recycler, who issues the certificate.",
  },
  {
    activity: "E-waste and battery recycling",
    note: "Performed by authorised recyclers, who issue the certificate. FSWS collects, grades and transfers under traceable custody.",
  },
  {
    activity: "Paper repulping",
    note: "Performed at the receiving mill, which issues the end-use certificate.",
  },
] as const;
