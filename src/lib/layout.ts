/**
 * Header metrics, in one place.
 *
 * Three files have to agree on these or the first screen drifts: the header
 * itself, the top padding `main` uses to clear it (it is fixed, not sticky),
 * and the negative margin the homepage uses to cancel that padding so its
 * full-height hero starts at the true top of the page.
 *
 * OFFSET and OFFSET_NEGATIVE must mirror SOLID exactly. Interior routes are
 * always solid, so that is the height they need to clear.
 */

/** Compact state, once the hero has scrolled past. Also the height every
 *  interior page reserves. */
export const HEADER_SOLID = "h-14 lg:h-16";

/** Resting state over the hero, taller so the enlarged mark has room. */
export const HEADER_TALL = "h-20 lg:h-24";

/** Applied to `main`. Mirrors HEADER_SOLID. */
export const HEADER_OFFSET = "pt-14 lg:pt-16";

/** Applied to the homepage's first screen. Cancels HEADER_OFFSET. */
export const HEADER_OFFSET_NEGATIVE = "-mt-14 lg:-mt-16";
