'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * Spacer that dynamically measures the combined height of
 * the fixed promo banner + navbar and creates matching space
 * so content is never hidden behind them.
 */
export function FixedHeaderSpacer() {
  const { promoBannerHeight } = useAppStore();
  const [navHeight, setNavHeight] = useState(68);

  useEffect(() => {
    const navEl = document.querySelector('nav');
    if (navEl) {
      const update = () => setNavHeight(navEl.offsetHeight);
      update();
      const observer = new ResizeObserver(update);
      observer.observe(navEl);
      return () => observer.disconnect();
    }
  }, []);

  const totalHeight = promoBannerHeight + navHeight;

  return (
    <div
      className="w-full flex-shrink-0 transition-[height] duration-500"
      style={{ height: totalHeight }}
      aria-hidden="true"
    />
  );
}
