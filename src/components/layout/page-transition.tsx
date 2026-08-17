"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Page transition: green out, then clear out.
 *
 * Both halves travel the same way. A green disc opens from the pointer until
 * the old page is gone, the next route loads behind it, and then a hole opens
 * from the same point until the green is gone. Nothing ever contracts, so the
 * pair reads as one continuous movement outward rather than as a lid closing
 * and reopening.
 *
 * The second half is a hole rather than the page growing over the top. Growing
 * the page means clipping it, and a clipped wrapper becomes the containing
 * block for the fixed header, so the bar has to be put back afterwards. Here
 * nothing is done to the page at all, which is also why the arriving page can
 * never flash or shift.
 *
 * The hole is cut with an SVG mask, which is the one primitive that does this
 * without a radial gradient. One `<rect>` and one `<circle>` serve both halves;
 * only their fills swap:
 *
 *   out    rect black, circle white   green shows inside the growing circle
 *   clear  rect white, circle black   green is removed inside it
 *
 * The swap happens at the instant the first half ends, where the circle has
 * already covered the screen. Green everywhere either way, so the two states
 * are pixel identical at the handover and there is no seam.
 *
 * The origin is where the pointer actually was when the link was clicked, so it
 * opens under the finger rather than from a corner the reader was not looking
 * at. Keyboard activation carries no coordinates, so those fall back to the
 * centre of the link itself, which is where the eye already is.
 *
 * Interception happens in the capture phase, before the Link's own handler.
 * Next's Link checks `defaultPrevented` and stands down, so calling
 * preventDefault is enough to take the navigation over without stopping the
 * event or reaching into the router's internals.
 *
 * While the green is up the router push may still be fetching. That is the
 * point of holding it: the wait happens behind the green rather than as a blank
 * frame. A timeout releases it if the navigation never lands, so a failure
 * degrades to an ordinary page rather than a green screen.
 *
 * The mark sits at the middle of the screen throughout, wearing the same mask,
 * so it belongs to the green and to nothing else.
 *
 * Anyone who has asked for reduced motion is not intercepted at all: links
 * navigate the ordinary way and none of this runs. That is checked live rather
 * than once at mount, because the CSS reduced-motion block cannot switch this
 * off. See `sync` below.
 */

const OUT_MS = 520;
const CLEAR_MS = 600;

/** Released if a navigation never lands. */
const STUCK_MS = 3000;

const EASE_OUT = "cubic-bezier(0.22, 0.61, 0.36, 1)";

const MASK_ID = "fsws-transition-mask";
const SOFT_ID = "fsws-transition-soft";

/**
 * Gaussian blur on the mask circle, in pixels of standard deviation. It is the
 * circle that is blurred, never the plate: blurring the plate would soften the
 * four screen edges as well and let the page show through around the border.
 * Blurring only the mask means the moving edge is the sole soft thing on
 * screen, and the fill stays flat green everywhere behind it.
 */
const SOFT_EDGE = 30;

/**
 * The mark, at the middle of the screen rather than at the origin.
 *
 * It carries the same mask as the green plate, so it exists only where the
 * green does: it is uncovered as the circle sweeps past the centre, sits there
 * while the next route loads, and is taken away again when the hole reaches it.
 * Because the mask edge is blurred, it arrives and leaves as a soft wipe rather
 * than appearing whole.
 */
const LOGO_PX = 140;

/**
 * Opacity of the mark. It is never true white: at this weight the white artwork
 * composites with the ground to a desaturated green rather than to #fff, so it
 * reads as burned into the colour instead of printed on top of it.
 *
 * Size and opacity move together. Fading the mark costs it presence, so it has
 * to be given more area to register at all; drop this further and LOGO_PX has
 * to grow again or the mark disappears.
 */
const LOGO_OPACITY = 0.22;

/**
 * The mark fades rather than being uncovered.
 *
 * The mask alone was too abrupt: the circle crosses the middle of the screen at
 * speed, so the mark went from nothing to full weight in a couple of frames.
 * The mask stays, because it is what guarantees the mark can never appear
 * outside the green, but the arrival and the exit are carried by opacity. The
 * fade in is held back until the green has had time to reach the centre, and
 * the fade out leads the hole so the mark is gone before its edge reaches it.
 */
const LOGO_FADE_MS = 300;
const LOGO_FADE_IN_DELAY = 170;

type Phase = "idle" | "out" | "held" | "clearing";
type Origin = { x: number; y: number };

/**
 * Distance from a point to whichever viewport corner is furthest from it, so
 * the circle always clears the screen whatever was clicked.
 *
 * The soft edge is added on top of that. A blurred edge is not an edge but a
 * ramp roughly three standard deviations wide, so a circle that only just
 * reaches the far corner arrives there half transparent, and the corner of the
 * old page stays faintly visible through it.
 */
function reach({ x, y }: Origin) {
  return (
    Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y),
    ) *
      1.02 +
    SOFT_EDGE * 3
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<SVGRectElement>(null);
  const holeRef = useRef<SVGCircleElement>(null);
  const markRef = useRef<SVGImageElement>(null);

  /** SVG has no `calc`, so the centring is arithmetic done at the moment it is
   *  needed. Doing it here rather than at render also means a window resized
   *  between navigations is accounted for. */
  const centreMark = () => {
    const mark = markRef.current;
    if (!mark) return;
    mark.setAttribute("x", String((window.innerWidth - LOGO_PX) / 2));
    mark.setAttribute("y", String((window.innerHeight - LOGO_PX) / 2));
  };

  /** In on the way out, out on the way in. Cancels first, so a navigation
   *  started before the last one finished cannot leave a held keyframe behind
   *  fighting the new animation. */
  const fadeMark = (appearing: boolean) => {
    const mark = markRef.current;
    if (!mark) return;
    mark.getAnimations().forEach((a) => a.cancel());
    mark.style.opacity = appearing ? "0" : String(LOGO_OPACITY);
    mark.animate(
      appearing
        ? [{ opacity: 0 }, { opacity: LOGO_OPACITY }]
        : [{ opacity: LOGO_OPACITY }, { opacity: 0 }],
      {
        duration: LOGO_FADE_MS,
        delay: appearing ? LOGO_FADE_IN_DELAY : 0,
        easing: appearing ? "ease-out" : "ease-in",
        fill: "forwards",
      },
    );
  };

  const phase = useRef<Phase>("idle");
  const pending = useRef<string | null>(null);
  const origin = useRef<Origin>({ x: 0, y: 0 });
  const stuck = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** The path we were on when it opened, so the second half only fires on a
   *  genuine change and not on the first render. */
  const from = useRef(pathname);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const release = () => {
      if (stuck.current) clearTimeout(stuck.current);
      if (overlayRef.current) overlayRef.current.style.visibility = "hidden";
      holeRef.current?.getAnimations().forEach((a) => a.cancel());
      markRef.current?.getAnimations().forEach((a) => a.cancel());
      if (markRef.current) markRef.current.style.opacity = "0";
      phase.current = "idle";
      pending.current = null;
    };

    const onClick = (event: MouseEvent) => {
      if (phase.current !== "idle") return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, or an in-page anchor: let the browser do its ordinary thing.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();

      const overlay = overlayRef.current;
      const plate = plateRef.current;
      const hole = holeRef.current;
      if (!overlay || !plate || !hole) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }

      // A keyboard-activated link reports 0,0 with no pointer behind it. Use
      // the middle of the link instead of opening from the top left corner.
      const box = anchor.getBoundingClientRect();
      const keyboard =
        event.detail === 0 || (event.clientX === 0 && event.clientY === 0);
      const at: Origin = keyboard
        ? { x: box.left + box.width / 2, y: box.top + box.height / 2 }
        : { x: event.clientX, y: event.clientY };

      phase.current = "out";
      pending.current = url.pathname + url.search + url.hash;
      origin.current = at;
      from.current = window.location.pathname;

      const r = reach(at);

      // Set the mask to its closed state BEFORE the overlay is shown. Making it
      // visible first and animating after leaves one frame painted at the
      // static state, which is a full green screen: that frame is the flash.
      plate.setAttribute("fill", "black");
      hole.setAttribute("fill", "white");
      hole.setAttribute("cx", String(at.x));
      hole.setAttribute("cy", String(at.y));
      hole.setAttribute("r", "0");
      centreMark();
      fadeMark(true);
      overlay.style.visibility = "visible";

      const out = hole.animate([{ r: "0px" }, { r: `${r}px` }], {
        duration: OUT_MS,
        easing: EASE_OUT,
        fill: "forwards",
      });

      out.finished
        .then(() => {
          phase.current = "held";
          if (pending.current) router.push(pending.current);
          stuck.current = setTimeout(release, STUCK_MS);
        })
        .catch(() => release());
    };

    /**
     * Attach or stand down, and re-run whenever the setting changes.
     *
     * Reading the query once at mount is not enough: someone who turns the
     * setting on mid-session would keep the transition until they reloaded.
     * Nor does the `prefers-reduced-motion` block in globals.css cover this.
     * That block neutralises `animation-duration` and `transition-duration`,
     * which are CSS animations and CSS transitions. Everything here is
     * `element.animate()`, which is the Web Animations API and is not affected
     * by those declarations at all. This listener is the only thing switching
     * it off, so it has to be the complete answer.
     */
    const sync = () => {
      document.removeEventListener("click", onClick, true);
      if (query.matches) {
        // Abort anything mid-flight rather than leaving green on the screen.
        release();
        return;
      }
      document.addEventListener("click", onClick, true);
    };

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("click", onClick, true);
      if (stuck.current) clearTimeout(stuck.current);
    };
  }, [router]);

  // The clear, once the new route has actually rendered.
  useEffect(() => {
    if (phase.current !== "held") return;
    if (pathname === from.current) return;

    const overlay = overlayRef.current;
    const plate = plateRef.current;
    const hole = holeRef.current;
    if (!overlay || !plate || !hole) return;

    if (stuck.current) clearTimeout(stuck.current);

    // Belt and braces: reaching "held" already requires the click handler, and
    // that is detached under reduced motion. If the setting was switched on
    // between the two halves, take the green away rather than animate it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overlay.style.visibility = "hidden";
      hole.getAnimations().forEach((a) => a.cancel());
      hole.setAttribute("r", "0");
      markRef.current?.getAnimations().forEach((a) => a.cancel());
      if (markRef.current) markRef.current.style.opacity = "0";
      phase.current = "idle";
      pending.current = null;
      from.current = pathname;
      return;
    }

    phase.current = "clearing";

    const at = origin.current;
    const r = reach(at);

    // Invert the mask and reset the circle. The held animation from the first
    // half has to be cancelled or it keeps forcing r to its end value.
    hole.getAnimations().forEach((a) => a.cancel());
    plate.setAttribute("fill", "white");
    hole.setAttribute("fill", "black");
    hole.setAttribute("cx", String(at.x));
    hole.setAttribute("cy", String(at.y));
    hole.setAttribute("r", "0");
    centreMark();
    fadeMark(false);

    const clear = hole.animate([{ r: "0px" }, { r: `${r}px` }], {
      duration: CLEAR_MS,
      easing: EASE_OUT,
      fill: "forwards",
    });

    const done = () => {
      overlay.style.visibility = "hidden";
      hole.getAnimations().forEach((a) => a.cancel());
      hole.setAttribute("r", "0");
      markRef.current?.getAnimations().forEach((a) => a.cancel());
      if (markRef.current) markRef.current.style.opacity = "0";
      phase.current = "idle";
      pending.current = null;
      from.current = pathname;
    };

    clear.finished.then(done).catch(done);
  }, [pathname]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col">{children}</div>

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] text-green-900"
        style={{ visibility: "hidden" }}
      >
        <svg className="h-full w-full" focusable="false">
          <defs>
            {/* The filter region has to be given in user space and made
                generous. Left on its bounding box default it would be a box
                around a circle of radius zero, which is nothing at all, and the
                blur would have no room to spread once the circle grew. */}
            <filter
              id={SOFT_ID}
              filterUnits="userSpaceOnUse"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation={SOFT_EDGE} />
            </filter>
            <mask id={MASK_ID} maskUnits="userSpaceOnUse">
              <rect ref={plateRef} width="100%" height="100%" fill="black" />
              <circle
                ref={holeRef}
                cx="0"
                cy="0"
                r="0"
                fill="white"
                filter={`url(#${SOFT_ID})`}
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="currentColor"
            mask={`url(#${MASK_ID})`}
          />
          <image
            ref={markRef}
            href="/brand/fsws-white.svg"
            width={LOGO_PX}
            height={LOGO_PX}
            x="0"
            y="0"
            opacity={0}
            mask={`url(#${MASK_ID})`}
          />
        </svg>
      </div>
    </>
  );
}
