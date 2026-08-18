"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Swatch as SwatchType } from "@/content/brand";

/**
 * A colour chip that hands you its hex.
 *
 * The one thing anyone actually does on a palette page is copy a value out of
 * it, and the usual way of doing that is to read six characters off the screen
 * and type them somewhere else, which is exactly the operation people get wrong.
 * The whole chip is the button.
 *
 * The name and role sit ON the colour rather than under it, so the swatch is as
 * large as the space allows: judging a colour from a stripe is guesswork, and
 * these get chosen for panels and page grounds. `reverse` says the chip is dark
 * enough to need its text knocked out, and it is set per swatch in content
 * rather than computed, because the two that sit near the threshold were looked
 * at rather than calculated.
 */
export function Swatch({ swatch }: { swatch: SwatchType }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(swatch.hex);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard is refused without a secure context or a user gesture the
      // browser trusts. Say nothing and leave the value on screen to be read.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${swatch.hex}, ${swatch.name}`}
      className={cn(
        "group relative flex h-44 w-full flex-col justify-between rounded-xl border p-5 text-left transition-colors",
        swatch.reverse
          ? "border-white/15 text-white"
          : "border-ink-200 text-ink-900",
      )}
      style={{ backgroundColor: swatch.hex }}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-[0.95rem] font-bold tracking-[-0.01em]">
          {swatch.name}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 transition-opacity",
            copied ? "opacity-100" : "opacity-0 group-hover:opacity-70",
          )}
        >
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </span>
      </span>

      <span>
        <span className="block font-mono text-sm">
          {copied ? "Copied" : swatch.hex}
        </span>
        <span
          className={cn(
            // Measured, not chosen. This line is text-xs, so it needs 4.5:1
            // against its own chip. At white/70 the Violation chip came out at
            // 3.89 and at ink-600 the Gray chip came out at 4.04: both are the
            // most saturated member of their half of the palette, and both
            // failed. white/80 puts the worst reversed chip at 4.68 and ink-900
            // puts the worst light one at 6.92.
            "mt-1.5 block text-xs leading-snug",
            swatch.reverse ? "text-white/80" : "text-ink-900",
          )}
        >
          {swatch.use}
        </span>
      </span>
    </button>
  );
}
