import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The surface primitive. Flat: a 1px border and a radius, nothing else.
 *
 * Surfaces deliberately carry NO lip. The pressed-key treatment is reserved for
 * buttons, where it signals that a thing can be pushed. Putting it on cards too
 * made every panel look tappable and the page read as a pile of chunky tiles.
 * Depth on a card comes from its ground and its border, not from a base edge.
 *
 * Nested radii are corrected: an inner element inset by N uses the outer radius
 * minus N, or the corners look wrong. Use the --radius-* steps rather than
 * repeating the outer value.
 */
const panelVariants = cva("relative", {
  variants: {
    tone: {
      /** White card on a light ground. */
      plain: "bg-white border border-ink-200",
      /** Tinted card, for grouping inside a white section. */
      tint: "bg-green-50 border border-green-100",
      /** On the dark ground. */
      deep: "bg-green-900 border border-green-800",
      /** Over the video: translucent so footage reads through the edges. */
      overlay:
        "bg-green-900/55 border border-white/15 backdrop-blur-[2px]",
    },
    radius: {
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
    },
  },
  defaultVariants: { tone: "plain", radius: "xl" },
});

function Panel({
  className,
  tone,
  radius,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof panelVariants>) {
  return (
    <div
      data-slot="panel"
      className={cn(panelVariants({ tone, radius }), className)}
      {...props}
    />
  );
}

/** Small pill for metadata. Flat, like every other non-button surface. */
const chipVariants = cva(
  "inline-flex w-fit shrink-0 self-start items-center gap-1.5 rounded-md px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.1em] uppercase",
  {
    variants: {
      tone: {
        tint: "bg-green-50 text-green-700 border border-green-100",
        deep: "bg-green-800 text-green-100 border border-green-700",
        plain:
          "bg-white text-ink-600 border border-ink-200",
      },
    },
    defaultVariants: { tone: "tint" },
  },
);

function Chip({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return (
    <span className={cn(chipVariants({ tone }), className)} {...props} />
  );
}

export { Panel, Chip, panelVariants };
