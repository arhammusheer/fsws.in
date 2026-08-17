"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { nav, cta } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The only interactive piece in the header.
 *
 * Built on the shadcn Sheet rather than on Dialog by hand. The hand-built
 * version was the same Radix primitive underneath and reimplemented the same
 * things, minus the enter and exit animations, which is exactly what got
 * missed: it opened and closed with no transition at all until someone
 * noticed. Sheet ships that, along with focus trapping, escape, scroll lock and
 * the close control.
 *
 * The registry version ships `shadow-lg` on its content. That is stripped in
 * ui/sheet.tsx, along with the ring utilities on the other installed
 * components; see the note at the top of that file.
 *
 * `solid` mirrors the header so the trigger reverses over the hero.
 */
export function MobileNav({ solid = true }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className={cn(
          "flex size-11 items-center justify-center rounded-lg border transition-[background-color,border-color] duration-300",
          solid
            ? "border-ink-200 bg-white text-green-900 active:bg-green-50"
            : "border-white/30 bg-white/10 text-white active:bg-white/20",
        )}
      >
        <MenuIcon className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[min(21rem,88vw)] gap-0 border-l border-ink-200 bg-white p-6 sm:max-w-none"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
            Menu
          </SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
}
