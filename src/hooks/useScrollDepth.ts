import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackScrollDepth } from '@/utils/analytics';

const MILESTONES = [25, 50, 75, 90];

export function useScrollDepth() {
  const { pathname } = useLocation();
  const reached = useRef(new Set<number>());

  useEffect(() => {
    reached.current = new Set();

    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;

      const pct = Math.round((scrollTop / scrollHeight) * 100);

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !reached.current.has(milestone)) {
          reached.current.add(milestone);
          trackScrollDepth(milestone, pathname);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);
}
