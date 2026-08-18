import Image from "next/image";
import Link from "next/link";

import { Rule } from "@/components/layout/section";
import { Ripple } from "@/components/ui/ripple";
import { nav, contact, site } from "@/content/site";
import { registrations, consent } from "@/content/credentials";

/**
 * The ripple is centred on the footer's bottom-right corner, so three quarters
 * of the field sits outside the frame. That is the point: it reads as something
 * continuing past the page rather than an ornament placed on it, and it sweeps
 * up and to the left across empty ground instead of sitting behind the brand
 * block. It is decorative and must stay that way.
 */
export function Footer() {
  return (
    <footer
      data-ground="deep"
      className="relative isolate overflow-hidden bg-green-900 text-white"
    >
      <Ripple className="right-0 bottom-0 size-[720px] translate-x-1/2 translate-y-1/2 text-green-600 opacity-70 lg:size-[960px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/fsws-white.svg"
              alt=""
              width={48}
              height={48}
              className="size-11"
            />
            <p className="mt-5 text-lg font-extrabold tracking-[-0.015em]">
              {site.legalName}
            </p>
            <p className="mt-2 max-w-[34ch] text-sm text-green-200">
              {contact.address}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-[0.7rem] font-bold tracking-[0.16em] text-green-200 uppercase">
              Site
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                ...nav,
                { label: "Contact", href: "/contact" },
                // The brand guide is noindex and out of the primary nav: a working
                // reference for whoever makes FSWS documents, not a page competing
                // with the site. The footer is where you go looking for it.
                { label: "Brand", href: "/brand" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-sm text-sm text-white/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[0.7rem] font-bold tracking-[0.16em] text-green-200 uppercase">
              Contact
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 font-mono text-sm">
              <li>
                <a href={`mailto:${contact.email}`} className="rounded-sm text-white/90 transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="rounded-sm text-white/90 transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={contact.altPhoneHref} className="rounded-sm text-white/90 transition-colors hover:text-white">
                  {contact.altPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Rule className="mt-14" />

        {/* Labels are green-200/70, not /60. At /60 on this ground they measure
            4.46:1, which is under AA for text this size. The same /60 is fine
            on the homepage strip because that sits on green-950, a darker
            ground, where it comes out at 4.76. */}
        <div className="mt-8 flex flex-col gap-4 text-xs text-green-200 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.legalName}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono">
            {registrations
              .filter((r) => ["CIN", "GSTIN", "Udyam registration"].includes(r.label))
              .map((r) => (
                <li key={r.label}>
                  <span className="text-green-200/70">{r.label} </span>
                  {r.value}
                </li>
              ))}
            <li>
              <span className="text-green-200/70">UKPCB CAF </span>
              {consent.cafId}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
