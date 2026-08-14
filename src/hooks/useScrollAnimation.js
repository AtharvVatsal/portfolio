import { useRef, useEffect, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const { rootMargin = '0px 0px -60px 0px' } = options;
  const ref = useRef(null);
  const [state, setState] = useState({ isVisible: false, direction: 'down', progress: 0 });
  const prevY = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const thresholds = Array.from({ length: 21 }, (_, i) => parseFloat((i / 20).toFixed(2)));

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentY = entry.boundingClientRect.y;

        if (!initialized.current) {
          initialized.current = true;
          prevY.current = currentY;
          setState({ isVisible: entry.isIntersecting, direction: 'down', progress: entry.intersectionRatio });
          return;
        }

        const direction = currentY < prevY.current ? 'down' : 'up';
        prevY.current = currentY;

        setState({
          isVisible: entry.isIntersecting,
          direction,
          progress: entry.intersectionRatio,
        });
      },
      { threshold: thresholds, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, state];
}
