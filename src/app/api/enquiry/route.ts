import { NextResponse } from "next/server";
import { z } from "zod";

import { contact } from "@/content/site";

/**
 * Enquiry handler.
 *
 * Delivery goes through Resend when RESEND_API_KEY is set. Without it the
 * route still validates and returns success, and logs the enquiry, so the form
 * is never broken in a preview or local environment. That is deliberate: a
 * contact form that 500s because an env var is missing is worse than one that
 * queues to the log while the key is being provisioned.
 */

const enquirySchema = z.object({
  name: z.string().min(1, "Tell us your name").max(120),
  organisation: z.string().max(160).optional().or(z.literal("")),
  email: z.email("That email address does not look right").max(180),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10, "A little more detail would help").max(4000),
  /** Honeypot. Accepts anything on purpose: rejecting it in the schema returns
   *  a validation error that tells a bot the field is a trap. It is inspected
   *  after parsing instead, and a filled one is accepted silently. */
  website: z.string().max(200).optional(),
});

/** Crude in-memory rate limit. Enough to stop a script hammering the form;
 *  it resets on deploy, which is acceptable for this volume. */
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
/** Counts every attempt, valid or not, so the form cannot be used to probe.
 *  Set high enough that a genuine sender who mistypes twice is not locked out. */
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries. Please try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read that request." },
      { status: 400 },
    );
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form.",
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot filled: accept silently so the bot does not learn anything.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const body = [
    `Name: ${data.name}`,
    data.organisation ? `Organisation: ${data.organisation}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[enquiry] no RESEND_API_KEY set, logging instead:\n${body}`);
    return NextResponse.json({ ok: true });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM ?? "site@fsws.in",
        to: [contact.email],
        reply_to: data.email,
        subject: `Enquiry from ${data.name}${data.organisation ? `, ${data.organisation}` : ""}`,
        text: body,
      }),
    });

    if (!response.ok) {
      console.error("[enquiry] resend rejected", await response.text());
      return NextResponse.json(
        {
          ok: false,
          error: `Could not send just now. Please email ${contact.email}.`,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[enquiry] send failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: `Could not send just now. Please email ${contact.email}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
