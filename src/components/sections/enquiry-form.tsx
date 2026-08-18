"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Panel } from "@/components/ui/panel";
import { contact } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

/* Flat, like every other non-button surface. */

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
        {/* Deliberately plain elements, not Input and Label. This field exists
            to be filled in by something that is not a person, and dressing it
            like the real ones only helps it be recognised. */}
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="organisation">Organisation</Label>
          <Input id="organisation" name="organisation" className="mt-2" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" className="mt-2" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">
          The site, the streams and rough volumes
        </Label>
        <Textarea id="message" name="message" rows={6} required className="mt-2 resize-y" />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">{error}</p>
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
