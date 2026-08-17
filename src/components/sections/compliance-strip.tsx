import { registrations, consent } from "@/content/credentials";

/**
 * Registration ticker directly beneath the hero. A group pattern: the sister
 * site runs the same band of facts under its hero. It gives the page a dense
 * factual line before any prose starts, and puts the numbers a procurement
 * reader checks first within reach of the opening screen.
 *
 * Two layouts, because a ticker is a ticker only while it fits on one line.
 * From sm it is a single row. Below that the same items are a two column grid
 * with the label set over the value, which is the shape the data actually
 * wants: the values are identifiers of very different lengths, and letting them
 * wrap inline produced a ragged block where it was no longer obvious which
 * number belonged to which label.
 *
 * On a phone this sits below the fold by design. The hero takes the first
 * screen alone there, and this is the first thing met on scrolling.
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
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 py-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8 sm:py-3.5 md:gap-x-12">
          {items.map((item) => (
            <li key={item.k} className="sm:flex sm:items-baseline sm:gap-2">
              <span className="block text-[0.62rem] font-bold tracking-[0.16em] text-green-200/60 uppercase">
                {item.k}
              </span>
              <span className="mt-1 block font-mono text-[0.78rem] text-green-200 sm:mt-0">
                {item.v}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
