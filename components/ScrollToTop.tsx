"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      // On first mount, also scroll to top
    }
    window.scrollTo(0, 0);
    // Also force after a micro-task in case layout shift
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname]);

  return null;
}
