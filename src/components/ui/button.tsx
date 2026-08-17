import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Flat buttons. One hairline border, a fill, a hover tint, and nothing else.
 *
 * These used to carry a "lip": a thicker bottom border in the next darker step
 * of the ramp, collapsing to 1px on press with a matching translate, so the key
 * looked depressed. It is gone. Nothing on this site is pretending to be a
 * physical object any more, and a bevel on the only interactive element made
 * the buttons the odd thing out rather than the confident thing.
 *
 * There are NO SHADOWS, and now no bevels either. The whole surface treatment
 * is border, radius and fill, which is why it stays crisp at any zoom and never
 * smudges over the video hero.
 *
 * Feedback on press is a tint change only. Height is constant in every state,
 * so a pressed button never nudges its neighbours and the row never reflows.
 *
 * There is no `focus-visible:ring-*`. Tailwind implements rings with box-shadow,
 * so a ring would smuggle a shadow back in. The focus indicator is the
 * `:focus-visible` outline set globally in globals.css, which is the modern,
 * non-shadow way to draw one and follows the element's border-radius.
 *
 * background-color is deliberately NOT transitioned. Swapping variant (the
 * header does it on scroll) is a state change rather than an animation, and
 * interpolating between the light and primary backgrounds left the header CTA
 * sitting mid-transition as white text on a white field.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-bold tracking-[-0.01em] select-none",
    "transition-[border-color] duration-100 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Solid green. The default call to action. */
        primary: [
          "bg-green-600 text-white border border-green-700",
          "hover:bg-green-500 hover:border-green-600",
          "active:bg-green-700 active:border-green-800",
        ].join(" "),
        /** For dark grounds: solid white. */
        light: [
          "bg-white text-green-900 border border-white",
          "hover:bg-green-50 hover:border-green-50",
          "active:bg-green-100 active:border-green-100",
        ].join(" "),
        /** Outlined, on light grounds. */
        outline: [
          "bg-white text-green-900 border border-ink-200",
          "hover:bg-green-50 hover:border-green-300",
          "active:bg-green-100 active:border-green-300",
        ].join(" "),
        /** Outlined, on dark grounds. */
        ghostLight: [
          "bg-transparent text-white border border-white/30",
          "hover:bg-white/10 hover:border-white/50",
          "active:bg-white/20 active:border-white/60",
        ].join(" "),
        /** Inline text action. Not a surface at all. */
        link: "text-green-600 underline-offset-4 hover:underline font-bold",
      },
      size: {
        sm: "h-9 rounded-md px-4 text-[0.8rem]",
        md: "h-11 rounded-lg px-5 text-sm",
        lg: "h-[3.25rem] rounded-xl px-7 text-[0.95rem]",
      },
    },
    compoundVariants: [
      { variant: "link", size: "sm", className: "h-auto px-0" },
      { variant: "link", size: "md", className: "h-auto px-0" },
      { variant: "link", size: "lg", className: "h-auto px-0" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
