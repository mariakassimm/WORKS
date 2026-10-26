import { useEffect, useState } from "react";

/**
 * True while `ref`'s element intersects the viewport. Used to pause
 * decorative animations (CSS animations and canvas loops) that are scrolled
 * out of view so they cost nothing. The observer is disconnected on unmount.
 */
export default function useOnScreen(ref, rootMargin = "80px") {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return onScreen;
}
