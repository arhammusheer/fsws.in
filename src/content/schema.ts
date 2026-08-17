import { z } from "zod";

/**
 * Content schemas. Every content module is parsed through one of these at
 * module load, so a missing field or a typo fails `next build` rather than
 * reaching production.
 *
 * Copy rules enforced by `prose` below, carried from the print work:
 *   - no em dashes
 *   - none of the claims brand.fsws.in prohibits
 * Numbers that appear in copy must be traceable to a document. The authorised
 * capacities in credentials.ts come from the UKPCB consent; nothing else on the
 * site may state a tonnage.
 */

const BANNED = [
  { pattern: /—/, why: "em dash: use a comma, colon or full stop" },
  { pattern: /\bzero waste\b/i, why: "prohibited claim (brand.fsws.in)" },
  { pattern: /\b100\s*%\s*eco/i, why: "prohibited claim (brand.fsws.in)" },
  { pattern: /\bleading provider\b/i, why: "unevidenced superlative" },
  { pattern: /\beco-friendly\b/i, why: "unevidenced claim" },
  { pattern: /\bworld[- ]class\b/i, why: "unevidenced superlative" },
  { pattern: /\bbest[- ]in[- ]class\b/i, why: "unevidenced superlative" },
] as const;

/** A string of user-facing copy, checked against the brand's banned language. */
export const prose = z.string().superRefine((value, ctx) => {
  for (const { pattern, why } of BANNED) {
    if (pattern.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: `Banned copy in ${JSON.stringify(value.slice(0, 60))}: ${why}`,
      });
    }
  }
});

export const detailSchema = z.object({
  label: z.string(),
  body: prose,
});

export const streamSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Two-digit index. The cohesion device: it appears on the routing map, in
   *  the summary table and as the oversized marker on the stream page. */
  index: z.string().regex(/^\d{2}$/),
  name: z.string(),
  qualifier: z.string().optional(),
  summary: prose,
  processing: prose,
  endUse: prose,
  /** Who physically performs the recovery. Drives the filled vs hollow node on
   *  the routing map, and therefore who issues the certificate. */
  processedBy: z.enum(["fsws", "external"]),
  certifier: z.string(),
  /** False where material re-enters service without being reprocessed, which
   *  the map draws as a dotted tail. Currently only rigid plastic reuse. */
  reprocessed: z.boolean(),
  detail: z.array(detailSchema).min(1),
});

export const capacitySchema = z.object({
  process: z.string(),
  quantity: z.string(),
  period: z.string(),
});

export const credentialSchema = z.object({
  label: z.string(),
  value: z.string(),
  note: z.string().optional(),
});

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.string().regex(/^\d{2}$/),
  title: z.string(),
  summary: prose,
  points: z.array(prose).min(1),
});

export const productSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  /** Which line it comes off. Drives the grouping on /products. */
  category: z.enum(["ash", "green"]),
  madeFrom: z.string(),
  summary: prose,
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  images: z.array(z.string().startsWith("/")),
});

export const clientSchema = z.object({
  name: z.string(),
  logo: z.string().startsWith("/"),
  /**
   * Optical correction, applied on top of the wall's uniform mark height.
   *
   * Setting every mark to the same measured height does not make them look the
   * same size. A wide, heavy wordmark with no ascenders and no descriptor line
   * fills its box completely and reads far larger than a square mark or one
   * carrying a tagline underneath. Only set this where a mark is visibly out of
   * step with its neighbours, and say which way in a comment.
   */
  scale: z.number().min(0.4).max(1.4).optional(),
});

export const faqSchema = z.object({
  question: z.string(),
  answer: prose,
});

/**
 * Parse and surface a readable error. Zod's default message is a JSON blob,
 * which is unhelpful when the failure happens during a build.
 */
export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
  source: string,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content in ${source}:\n${issues}`);
  }
  return result.data;
}
