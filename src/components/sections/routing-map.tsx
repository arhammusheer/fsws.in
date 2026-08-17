import type { Stream } from "@/content/streams";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";

/**
 * The routing map. It renders straight from the stream data, so the diagram
 * cannot drift out of step with the prose:
 *
 *   node 1  collection at Haridwar, always FSWS, always filled
 *   node 2  the processor. Filled where FSWS performs the recovery under its
 *           own consent, hollow where a registered third party does and
 *           therefore holds the licence and issues the certificate
 *   node 3  the end use
 *
 * The segment between processor and end use is dotted where `reprocessed` is
 * false, which is material returning to service without being reprocessed.
 *
 * Below md the tracks stop being tracks: shrinking a three-station diagram to a
 * phone width makes it unreadable, so each stream becomes a lipped panel.
 */

function Node({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border",
        filled ? "border-green-600 bg-green-600" : "border-green-600 bg-white",
      )}
    />
  );
}

export function RoutingMap({ streams }: { streams: readonly Stream[] }) {
  return (
    <div>
      {/* ---------- md and up: three-station tracks ---------- */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[15rem_1fr_15rem] items-end gap-x-6 border-b border-green-600 pb-3">
          <span className="text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
            Stream
          </span>
          <div className="relative h-4">
            {[
              { at: "0%", label: "FSWS Haridwar", tx: "translate-x-0" },
              { at: "50%", label: "Processor", tx: "-translate-x-1/2" },
              { at: "100%", label: "End use", tx: "-translate-x-full" },
            ].map((s) => (
              <span
                key={s.label}
                style={{ left: s.at }}
                className={cn(
                  "absolute top-0 text-[0.7rem] font-bold tracking-[0.16em] whitespace-nowrap text-green-600 uppercase",
                  s.tx,
                )}
              >
                {s.label}
              </span>
            ))}
          </div>
          <span className="text-right text-[0.7rem] font-bold tracking-[0.16em] text-green-600 uppercase">
            Certificate
          </span>
        </div>

        {streams.map((stream) => (
          <div
            key={stream.slug}
            className="grid grid-cols-[15rem_1fr_15rem] items-center gap-x-6 border-b border-ink-200 py-5 last:border-b-0"
          >
            <div>
              <span className="block font-mono text-xs text-green-600">
                {stream.index}
              </span>
              <span className="font-bold text-green-900">{stream.name}</span>
              {stream.qualifier ? (
                <span className="block text-xs text-ink-600">
                  {stream.qualifier}
                </span>
              ) : null}
            </div>

            <div className="relative h-3">
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-px w-1/2 -translate-y-1/2 bg-green-200"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 left-1/2 h-0 w-1/2 -translate-y-1/2 border-t border-green-200",
                  stream.reprocessed ? "border-solid" : "border-dotted",
                )}
              />
              <span className="absolute left-0">
                <Node filled />
              </span>
              <span className="absolute left-1/2">
                <Node filled={stream.processedBy === "fsws"} />
              </span>
              <span className="absolute left-full">
                <Node filled />
              </span>
            </div>

            <div className="text-right">
              <span className="block text-sm text-ink-900">
                {stream.endUse}
              </span>
              <span className="mt-1 block text-[0.7rem] font-bold tracking-[0.14em] text-ink-600 uppercase">
                {stream.certifier}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- below md: one panel per stream ---------- */}
      <ul className="grid gap-3 md:hidden">
        {streams.map((stream) => (
          <li key={stream.slug}>
            <Panel tone="plain" radius="lg" className="p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-green-600">
                  {stream.index}
                </span>
                <span className="font-bold text-green-900">
                  {stream.name}
                  {stream.qualifier ? (
                    <span className="font-normal text-ink-600">
                      , {stream.qualifier}
                    </span>
                  ) : null}
                </span>
              </div>
              {/* Processor and certifier are the same party by design: whoever
                  performs the recovery issues the certificate. One row, not two
                  rows repeating a value. */}
              <dl className="mt-4 grid grid-cols-[5.5rem_1fr] gap-y-2 text-sm">
                <dt className="text-[0.7rem] font-bold tracking-[0.14em] text-green-600 uppercase">
                  End use
                </dt>
                <dd className="text-ink-900">{stream.endUse}</dd>
                <dt className="text-[0.7rem] font-bold tracking-[0.14em] text-green-600 uppercase">
                  Certified by
                </dt>
                <dd className="font-medium text-green-900">
                  {stream.processedBy === "fsws"
                    ? "FSWS, Haridwar"
                    : stream.certifier}
                </dd>
              </dl>
            </Panel>
          </li>
        ))}
      </ul>

      <ul className="mt-8 flex flex-col gap-2 font-mono text-[0.72rem] text-ink-600 sm:flex-row sm:flex-wrap sm:gap-x-8">
        <li className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full border border-green-600 bg-green-600"
          />
          Processed by FSWS under its own consent
        </li>
        <li className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full border border-green-600 bg-white"
          />
          Processed by a registered external party
        </li>
      </ul>
    </div>
  );
}
