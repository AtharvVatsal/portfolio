import { useEffect, useState } from 'react';

// Live result of a media query (reduced motion, hover capability, …).
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const q = window.matchMedia(query);
    const update = () => setMatches(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, [query]);
  return matches;
};

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export default useMediaQuery;
