"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns `true` when the header should be visible.
 * - Scrolling down past `threshold` px hides it.
 * - Scrolling up at all shows it again.
 * - Always visible near the very top of the page.
 */
export function useHideOnScroll(threshold = 80) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY <= threshold) {
          setVisible(true);
        } else if (currentY > lastY.current) {
          // scrolling down
          setVisible(false);
        } else if (currentY < lastY.current) {
          // scrolling up
          setVisible(true);
        }

        lastY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}