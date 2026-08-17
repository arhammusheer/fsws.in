import { z } from "zod";
import { streamSchema, validate } from "./schema";

/**
 * The material streams FSWS collects, and where each one ends up.
 *
 * `processedBy` is the load-bearing field. Where it is "fsws" the work happens
 * at Haridwar under the company's own consent and FSWS issues the end-use
 * certificate. Where it is "external" a registered third party performs the
 * recovery, holds the licence, and issues the certificate, which FSWS forwards
 * unaltered. That distinction is the whole argument of the site, so it is data
 * rather than prose and the routing map renders straight from it.
 *
 * FSWS holds no plastic waste recycling registration and no e-waste
 * authorisation. Nothing here may imply otherwise.
 */
export const streams = validate(
  z.array(streamSchema).min(1),
  [
    {
      slug: "cardboard-and-paper",
      index: "01",
      name: "Cardboard and paper",
      summary:
        "Corrugated cartons, cores, offcuts and mixed paper, graded and baled for a paper mill.",
      processing: "Graded, cleared of contaminants, baled",
      endUse: "Repulped into liner, fluting and carton board",
      processedBy: "external",
      certifier: "Receiving paper mill",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Material is separated by grade (corrugated, mixed paper and white) and cleared of tape, plastic liners, metal fasteners and wet stock. It is then baled to mill specification, weighed and tagged to the consignment.",
        },
        {
          label: "End use",
          body: "At the mill the bales are slushed, screened and cleaned back to pulp, then formed into new liner, fluting and carton board. The fibre re-enters packaging manufacture and can be cycled repeatedly before it shortens beyond use.",
        },
        {
          label: "Certification",
          body: "FSWS holds no pulping capability. The end-use certificate is issued by the receiving mill and forwarded with the consignment reference attached.",
        },
        {
          label: "Limits",
          body: "Wax and grease coated board, and wet or contaminated stock, are not accepted for repulping. Where these occur the proportion is reported by weight. Paper is not sent for fuel, co-processing or refuse derived fuel.",
        },
      ],
    },
    {
      slug: "rigid-plastics-reuse",
      index: "02",
      name: "Rigid plastics",
      qualifier: "serviceable",
      summary:
        "Crates, trays, drums, bins and totes with working life left in them, cleaned and returned to service.",
      processing: "Inspected, washed, de-labelled",
      endUse: "Returned to service as crates, drums and bins",
      processedBy: "fsws",
      certifier: "FSWS",
      reprocessed: false,
      detail: [
        {
          label: "Assessment",
          body: "Items are checked for cracking, stress whitening and deformation under load. Anything that held chemicals or oils is excluded regardless of condition.",
        },
        {
          label: "End use",
          body: "Sound items are washed and de-labelled, then returned to service as handling containers. Nothing is reprocessed, so no material is lost to melting or regrind.",
        },
        {
          label: "Certification",
          body: "Cleaning and return to service is carried out by FSWS and declared by FSWS as reuse, not as recycling.",
        },
      ],
    },
    {
      slug: "rigid-plastics-recycling",
      index: "03",
      name: "Rigid plastics",
      qualifier: "end of life",
      summary:
        "Items that fail inspection, sorted to polymer and passed to a registered recycler.",
      processing: "Sorted by polymer, cleaned, baled",
      endUse: "Shredded, washed and pelletised into recycled granulate",
      processedBy: "external",
      certifier: "Registered recycler",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Sorted by polymer, cleaned of residue and baled. Mixed polymers reprocess to a lower value granulate, so material is sorted to type rather than baled as a single grade.",
        },
        {
          label: "End use",
          body: "At the recycler the bales are shredded, washed and pelletised into recycled granulate for moulding and extrusion.",
        },
        {
          label: "Certification",
          body: "Plastic waste recycling requires a registration FSWS does not hold. That certificate is issued by the registered recycler and forwarded unaltered.",
        },
      ],
    },
    {
      slug: "polythene-and-film",
      index: "04",
      name: "Polythene and soft plastics",
      summary:
        "Liners, shrink wrap, stretch film and bagging, graded by polymer and colour before transfer.",
      processing: "Graded by polymer and colour, cleaned, baled",
      endUse: "Pelletised into recycled polyethylene",
      processedBy: "external",
      certifier: "Registered recycler",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Film is separated from the mixed stream on receipt, since it contaminates the rigid and paper streams. It is graded by polymer family and by colour. Natural film carries a higher recycled value than mixed colour, so the two are baled separately.",
        },
        {
          label: "End use",
          body: "Shredded, washed, dried and pelletised into recycled polyethylene granulate, which re-enters manufacture as film, sacks, irrigation pipe and moulded products.",
        },
        {
          label: "Limits",
          body: "Multi-layer laminates and metallised film cannot be recycled as polyethylene. Where a consignment contains them, the proportion is reported. No film is sent for incineration, co-processing or refuse derived fuel.",
        },
      ],
    },
    {
      slug: "horticulture-and-green-waste",
      index: "05",
      name: "Horticulture and green waste",
      summary:
        "Garden and grounds waste, dry leaves and canteen waste, composted at Haridwar under consent.",
      processing: "Windrowed and composted with a proprietary culture",
      endUse: "TerraVita compost",
      processedBy: "fsws",
      certifier: "FSWS",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Green waste, dry leaves, cow dung and canteen waste are windrowed and composted using a proprietary bacterial culture. Composting is one of the processes named on the FSWS consent, at 600 MT per month.",
        },
        {
          label: "End use",
          body: "The output is TerraVita, a compost sold for soil improvement. The material leaves the site as a product rather than as waste.",
        },
        {
          label: "Certification",
          body: "Composting is carried out at the FSWS facility under its own consent, so FSWS issues the end-use certificate directly.",
        },
      ],
    },
    {
      slug: "industrial-ash",
      index: "06",
      name: "Industrial ash",
      summary:
        "Boiler and fly ash, blended with an FSWS binder and pressed into masonry units.",
      processing: "Blended, cold pressed, ambient cured",
      endUse: "EcoBricks and ash based masonry",
      processedBy: "fsws",
      certifier: "FSWS",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Ash is blended with an FSWS binder system and pressed into masonry units. The line is cold pressed and ambient cured. There is no kiln, so the process consumes no firing fuel.",
        },
        {
          label: "End use",
          body: "Blocks, pots, benches and boundary walls. The ash leaves the site bound into a product with a working life, rather than as fill.",
        },
        {
          label: "Certification",
          body: "The block line is operated by FSWS at Haridwar, so FSWS issues the end-use certificate directly.",
        },
      ],
    },
    {
      slug: "electronic-equipment",
      index: "07",
      name: "Electronic equipment",
      summary:
        "IT hardware, electronics and small appliances, graded for reuse or passed to an authorised recycler.",
      processing: "Sorted, graded, tested; refurbished where viable",
      endUse: "Returned to service, or metals recovered by an authorised recycler",
      processedBy: "external",
      certifier: "Authorised e-waste recycler",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Devices, components and accessories are sorted into defined categories with visual grading and basic testing. Where equipment can be repaired, upgraded or harvested for spares, its working life is extended and it does not enter the waste stream at all.",
        },
        {
          label: "End use",
          body: "Non-reusable fractions are routed to authorised e-waste recyclers for recovery of metals and other materials.",
        },
        {
          label: "Certification",
          body: "E-waste recycling requires an authorisation FSWS does not hold. The authorised recycler performs the recovery and issues the certificate, which FSWS forwards unaltered.",
        },
      ],
    },
    {
      slug: "used-batteries",
      index: "08",
      name: "Used batteries",
      summary:
        "Batteries from UPS systems, emergency lighting and handheld equipment, collected and transferred under traceable custody.",
      processing: "Collected, stored and transferred under traceable custody",
      endUse: "Materials recovered by an authorised recycler",
      processedBy: "external",
      certifier: "Authorised recycler",
      reprocessed: true,
      detail: [
        {
          label: "Processing",
          body: "Used batteries need careful handling and traceable disposal. FSWS coordinates collection, safe storage and transfer to an authorised downstream partner as a single window service.",
        },
        {
          label: "End use",
          body: "Recovery of lead, plastics and other materials at the authorised recycler.",
        },
        {
          label: "Certification",
          body: "Battery recycling is a licensed activity FSWS does not perform. The authorised recycler issues the certificate, which FSWS forwards unaltered.",
        },
      ],
    },
  ],
  "content/streams.ts",
);

export type Stream = (typeof streams)[number];

export const streamBySlug = (slug: string): Stream | undefined =>
  streams.find((s) => s.slug === slug);
