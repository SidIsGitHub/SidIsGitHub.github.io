/**
 * YEEZUS PHYSICS CONSTANTS
 *
 * These are the spring configurations for the entire project.
 * They are non-negotiable. Every motion in this site must feel
 * violent, physical, and intentional.
 *
 * No ease-in-out. No cubic-bezier. Springs only.
 */

/** Snappy, aggressive — page transitions, element entries */
export const VIOLENT_SPRING = { stiffness: 400, damping: 10 };

/** Weighty, deliberate — scroll-driven elements, heavy objects */
export const HEAVY_SPRING = { stiffness: 200, damping: 15 };

/** Slightly trailing — cursor mask, follows with physical lag */
export const CURSOR_SPRING = { stiffness: 300, damping: 20 };

/** Heavy flywheel — the Yeezus disc, massive rotational inertia */
export const DISC_SPRING = { stiffness: 150, damping: 8 };

/** Soft divine — gentle movements in the reveal layer */
export const DIVINE_SPRING = { stiffness: 80, damping: 25 };
