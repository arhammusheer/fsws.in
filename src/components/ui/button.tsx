import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Buttons carry the physicality of the whole site, so the technique is worth
 * stating once here.
 *
 * Each button sits on a "lip": a thicker bottom border in the next darker step
 * of its own colour ramp. That reads as a key with a side wall. Pressing it
 * collapses the lip to 1px and translates the button down by the difference, so
 * the top face travels while the base stays put and the key looks depressed.
 *
 * There are NO SHADOWS. Not on the button, not on hover, not on focus. The
 * depth is entirely border and translation, which is also why it stays crisp at
 * any zoom and never smudges over the video hero.
 *
 * Sizes keep the total height stable across the press by pairing the border
 * change with an equal translate, so a pressed button never nudges its
 * neighbours.
 *
 * There is no `focus-visible:ring-*` either. Tailwind implements rings with
 * box-shadow, so a ring would smuggle a shadow back in. The focus indicator is
 * the `:focus-visible` outline set globally in globals.css, which is the
 * modern, non-shadow way to draw one and follows the element's border-radius.
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
    "transition-[transform,border-color] duration-100 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Solid green key. The default call to action. */
        primary: [
          "bg-green-600 text-white border border-green-800",
          "border-b-[3px] border-b-green-900",
          "hover:bg-green-500",
          "active:translate-y-[2px] active:border-b",
        ].join(" "),
        /** For dark grounds: a white key with a cool grey base. */
        light: [
          "bg-white text-green-900 border border-ink-200",
          "border-b-[3px] border-b-ink-400",
          "hover:bg-green-50",
          "active:translate-y-[2px] active:border-b",
        ].join(" "),
        /** Outlined, still lipped so it feels like the same family. */
        outline: [
          "bg-white text-green-900 border border-ink-200",
          "border-b-[3px] border-b-ink-200",
          "hover:bg-green-50 hover:border-green-300",
          "active:translate-y-[2px] active:border-b",
        ].join(" "),
        /** Outlined for dark grounds. */
        ghostLight: [
          "bg-transparent text-white border border-white/30",
          "border-b-[3px] border-b-white/40",
          "hover:bg-white/10 hover:border-white/50",
          "active:translate-y-[2px] active:border-b",
        ].join(" "),
        /** Inline text action. No lip: it is not a surface. */
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
