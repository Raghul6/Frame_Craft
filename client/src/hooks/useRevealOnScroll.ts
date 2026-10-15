import { useEffect, type RefObject } from "react";
import { REVEAL_ROOT_MARGIN, REVEAL_THRESHOLD } from "../constants/ui";

/**
 * Fades in every `[data-reveal]` element inside `containerRef` the first time it
 * scrolls into view (adds `.is-visible`; the CSS lives in styles/animations.css).
 * One shared observer for the whole container keeps it cheap.
 */
export const useRevealOnScroll = (
  containerRef: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>("[data-reveal]");

    // Old browsers without IntersectionObserver just show everything.
    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: REVEAL_THRESHOLD },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
};
