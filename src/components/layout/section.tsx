import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page furniture and the single source of vertical rhythm.
 *
 * The spacing ladder follows the group system on vayasyaseva.com
 * (py-16 / sm:py-20 / lg:py-24) so the two sites feel related when opened side
 * by side, widened a step at the top end because this design runs airier.
 * Nothing should set its own section padding: change it here or the rhythm
 * drifts, which is what happened in the previous build.
 *
 * `ground` sets a data attribute rather than colour classes. globals.css
 * re-points the --ink tokens from it, so descendants read the right ink without
 * each one knowing which ground it sits on.
 */

type Ground = "light" | "tint" | "deep";

const grounds: Record<Ground, string> = {
  light: "bg-white",
  tint: "bg-green-50",
  deep: "bg-green-900",
};

export function Section({
  ground = "light",
  className,
  children,
  id,
  flush = false,
}: {
  ground?: Ground;
  className?: string;
  children: ReactNode;
  id?: string;
  /** Drops the vertical padding, for bands that set their own. */
  flush?: boolean;
}) {
  return (
    <section
      id={id}
      data-ground={ground}
      className={cn(
        "relative isolate overflow-hidden",
        grounds[ground],
        !flush && "py-16 sm:py-20 lg:py-28",
        className,
      )}
      style={{ color: "var(--ink)" }}
    >
      {children}
    </section>
  );
}

/** The measure. max-w-7xl matches the group system. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section opener. Left aligned by default: the group system centres, but this
 * brand's material is evidence rather than marketing and reads better ranged
 * left against the grid. `align="center"` is available for the few blocks that
 * are symmetrical by nature, such as the logo wall.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  className,
  align = "left",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Label>{eyebrow}</Label> : null}
      <Heading
        className={cn(
          "text-3xl leading-[1.1] font-extrabold tracking-[-0.025em] text-balance sm:text-4xl",
          eyebrow && "mt-4",
        )}
        style={{ color: "var(--ink-strong)" }}
      >
        {title}
      </Heading>
      {lede ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed text-pretty",
            align === "center" && "mx-auto",
          )}
          style={{ color: "var(--ink-soft)" }}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/** Small caps eyebrow. Orients a section without repeating its title. */
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[0.7rem] font-bold tracking-[0.16em] uppercase",
        className,
      )}
      style={{ color: "var(--label)" }}
    >
      {children}
    </p>
  );
}

/** Hairline that follows the ground. */
export function Rule({ className }: { className?: string }) {
  return (
    <hr
      className={cn("border-0 border-t", className)}
      style={{ borderColor: "var(--hairline)" }}
    />
  );
}
