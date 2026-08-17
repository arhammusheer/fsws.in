import { z } from "zod";
import { clientSchema, faqSchema, serviceSchema, validate } from "./schema";

/** The commercial offer, written for a procurement or EHS reader. */
export const services = validate(
  z.array(serviceSchema).min(1),
  [
    {
      slug: "collection-and-segregation",
      index: "01",
      title: "Collection and segregation",
      summary:
        "Scheduled collection from site, with material sorted to stream on arrival at Haridwar and recorded by weight.",
      points: [
        "Consignments weighed at the collection site and again on arrival",
        "Sorted to stream, with contaminants and moisture recorded by weight",
        "Movement against a delivery document, with an e-way bill where the consignment value requires one",
      ],
    },
    {
      slug: "end-use-documentation",
      index: "02",
      title: "End-use documentation",
      summary:
        "A certificate for every consignment, from the party that performed the recovery, tied back to the weights recorded at your gate.",
      points: [
        "Certificates issued by FSWS where the processing happens at Haridwar under its own consent",
        "Certificates issued by the mill or registered recycler where they perform the work, forwarded unaltered",
        "Each one referenced to the consignment and its weighments",
      ],
    },
    {
      slug: "reporting",
      index: "03",
      title: "Reporting",
      summary:
        "Weights reported by stream and by route, per consignment or on an agreed monthly cycle.",
      points: [
        "Split by route: reused, recycled, recovered, disposed",
        "Loads rejected downstream reported with the reason before invoicing",
        "Any fraction that cannot be recovered reported rather than absorbed into a single diversion figure",
      ],
    },
    {
      slug: "electronic-and-battery",
      index: "04",
      title: "Electronic equipment and batteries",
      summary:
        "A single window for IT hardware, electronics and used batteries, graded for reuse and otherwise transferred to authorised recyclers.",
      points: [
        "Assets tracked from pickup to final disposition",
        "Repair, upgrade and spares harvesting where equipment has life left",
        "Transfer to authorised recyclers, whose certificates are forwarded to you",
      ],
    },
    {
      slug: "audits",
      index: "05",
      title: "Waste audits",
      summary:
        "A survey of what a site actually generates, so segregation and contracts can be set against real composition rather than assumption.",
      points: [
        "Composition by stream and by weight",
        "Where value is being lost to poor segregation at source",
        "What can be routed to a higher recovery option than it is today",
      ],
    },
  ],
  "content/services.ts:services",
);

export const clients = validate(
  z.array(clientSchema).min(1),
  [
    { name: "ITC", logo: "/assets/clients/ITC-light.png" },
    { name: "Unilever", logo: "/assets/clients/Unilever-light.png" },
    { name: "Wipro", logo: "/assets/clients/Wipro-light.png" },
    { name: "BHEL", logo: "/assets/clients/BHEL-light.png" },
    { name: "EFS", logo: "/assets/clients/EFS-light.png" },
    // Solid geometric wordmark, no ascenders, no descriptor line: at the wall's
    // measured height it reads about half as large again as its neighbours.
    { name: "SKF India", logo: "/assets/clients/SKF-light.png", scale: 0.62 },
    { name: "Themis Medicare", logo: "/assets/clients/Themis-light.png" },
  ],
  "content/services.ts:clients",
);

export type Client = (typeof clients)[number];

/**
 * Cut from twelve generic entries to the questions a corporate buyer actually
 * asks during due diligence.
 */
export const faqs = validate(
  z.array(faqSchema).min(1),
  [
    {
      question: "Who issues the end-use certificate?",
      answer:
        "Whichever party performs the recovery. Where the processing happens at Haridwar under the FSWS consent, FSWS issues it. Where a paper mill or a registered recycler does the work, they issue it and FSWS forwards it unaltered with the consignment reference attached.",
    },
    {
      question: "Does FSWS hold a plastic waste recycling registration?",
      answer:
        "No. Plastic recycling is performed by a registered recycler, who holds the registration and issues the certificate. FSWS collects, sorts to polymer, cleans and bales. The consent held by FSWS covers compacting and grinding of plastic waste at 100 MT per month.",
    },
    {
      question: "What consent does FSWS operate under?",
      answer:
        "A Consolidated Consent to Operate and Authorisation from the Uttarakhand Pollution Control Board, granted under the Water Act, the Air Act and the Hazardous Waste Rules. CAF ID 23387, application 2652160, valid to 31 March 2030. A copy is provided on request.",
    },
    {
      question: "Can we audit the facility and the records?",
      answer:
        "Yes. The Haridwar facility and the consignment records are open to inspection, and visits to the receiving mill or recycler can be arranged. Records are retained per consignment.",
    },
    {
      question: "How is material tracked between our gate and its end use?",
      answer:
        "Each consignment is weighed and signed off at the collection site, moved against a delivery document, re-weighed on arrival at Haridwar, sorted to stream with contaminants recorded, then dispatched to the named processor against invoice and weighment. Receipt is acknowledged by the processor.",
    },
    {
      question: "What happens to material that cannot be recovered?",
      answer:
        "It is reported by weight with the reason, and the route is agreed rather than chosen for you. Wax and grease coated board, multi-layer laminates and metallised film are the usual cases.",
    },
    {
      question: "Do you report a single diversion figure?",
      answer:
        "No. Weights are reported against four routes separately: reused, recycled, recovered and disposed. A blended figure hides the difference between reuse and disposal and does not hold up under scrutiny.",
    },
    {
      question: "How do we start?",
      answer:
        "Tell us the site, the streams and the approximate volumes. We will come back with a collection schedule, the routes each stream would take and the certificate you would receive for each.",
    },
  ],
  "content/services.ts:faqs",
);

export type Faq = (typeof faqs)[number];
