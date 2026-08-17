"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { contact } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

/* Flat, like every other non-button surface. */
const field =
  "w-full rounded-lg border border-ink-200 bg-green-50/40 px-4 py-3 text-ink-900 outline-none transition-colors focus:border-green-600 focus:bg-white";
const labelCls =
  "block text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setError(result.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError(`Could not send. Please email ${contact.email}.`);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Panel tone="tint" radius="xl" className="p-8" role="status">
        <p className="font-bold text-green-900">Thank you, that has reached us.</p>
        <p className="mt-2 text-sm text-ink-600">
          We will come back with the routes each stream would take and the
          certificate you would receive for each. If it is urgent, call{" "}
          {contact.phone}.
        </p>
      </Panel>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {/* honeypot, positioned off-screen rather than display:none, which some
          bots skip */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Name</label>
          <input id="name" name="name" required className={`${field} mt-2`} />
        </div>
        <div>
          <label htmlFor="organisation" className={labelCls}>Organisation</label>
          <input id="organisation" name="organisation" className={`${field} mt-2`} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" required className={`${field} mt-2`} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" name="phone" type="tel" className={`${field} mt-2`} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          The site, the streams and rough volumes
        </label>
        <textarea id="message" name="message" rows={6} required className={`${field} mt-2 resize-y`} />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-[#b42318]">{error}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-6">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send enquiry"}
        </Button>
        <p className="text-sm text-ink-600">
          Or email{" "}
          <a href={`mailto:${contact.email}`} className="rounded-sm font-medium text-green-600 underline">
            {contact.email}
          </a>
        </p>
      </div>
    </form>
  );
}
