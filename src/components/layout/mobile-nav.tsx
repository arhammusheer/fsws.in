"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { nav, cta } from "@/content/site";
import { cn } from "@/lib/utils";

/** The only interactive piece in the header. Radix handles focus trapping,
 *  escape and scroll lock. No overlay blur or shadow: a flat scrim.
 *  `solid` mirrors the header so the trigger reverses over the hero. */
export function MobileNav({ solid = true }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className={cn(
          "flex size-11 items-center justify-center rounded-lg border transition-[background-color,border-color] duration-300",
          solid
            ? "border-ink-200 bg-white text-green-900 active:bg-green-50"
            : "border-white/30 bg-white/10 text-white active:bg-white/20",
        )}
      >
        <MenuIcon className="size-5" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-green-950/40" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(21rem,88vw)] flex-col border-l border-ink-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
              Menu
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-md border border-ink-200 text-ink-600"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="Primary" className="mt-8">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink-200 py-4 text-lg font-bold text-green-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Button asChild size="lg" className="mt-8 w-full">
            <Link href={cta.primary.href} onClick={() => setOpen(false)}>
              {cta.primary.label}
            </Link>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
