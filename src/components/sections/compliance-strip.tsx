import { registrations, consent } from "@/content/credentials";

/**
 * Registration ticker directly beneath the hero. A group pattern: the sister
 * site runs the same band of facts under its hero. It gives the page a dense
 * factual line before any prose starts, and puts the numbers a procurement
 * reader checks first inside the opening screen.
 */
export function ComplianceStrip() {
  const items = [
    ...registrations
      .filter((r) => ["CIN", "GSTIN", "Udyam registration"].includes(r.label))
      .map((r) => ({
        k: r.label === "Udyam registration" ? "Udyam" : r.label,
        v: r.value,
      })),
    { k: "UKPCB CAF", v: consent.cafId },
    { k: "Region", v: "Haridwar, Uttarakhand" },
  ];

  return (
    <div className="border-b border-green-800 bg-green-950">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3.5 md:gap-x-12">
          {items.map((item) => (
            <li key={item.k} className="flex items-baseline gap-2">
              <span className="text-[0.62rem] font-bold tracking-[0.16em] text-green-200/60 uppercase">
                {item.k}
              </span>
              <span className="font-mono text-[0.78rem] text-green-200">
                {item.v}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
