"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Written directly on Radix rather than pulled from shadcn, whose version ships
 * shadow utilities that would have to be stripped and would drift back in on
 * every update. Same reason the trigger uses a rotating plus rather than a
 * chevron: it matches the squared-off plus in the rest of the iconography.
 */

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-ink-200 last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 rounded-md py-5 text-left",
          "text-base font-bold text-green-900 transition-colors hover:text-green-600",
          className,
        )}
        {...props}
      >
        {children}
        <PlusIcon
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-green-600 transition-transform duration-200 group-data-[state=open]:rotate-45"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("max-w-2xl pb-6 text-ink-600", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
