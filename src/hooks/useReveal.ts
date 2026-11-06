import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Adds `.is-in` to every `[data-reveal]` element when it scrolls into view.
 * Mounted once in the layout; re-scans after each navigation.
 */
export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Lazy pages and async data render later: watch the DOM for new reveal targets.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
}
