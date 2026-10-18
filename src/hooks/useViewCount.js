import { useEffect, useState } from 'react';

// A field note's read count, from the counter at /api/views (api/views.js).
// The count is fetched on arrival; the read itself is recorded only after the
// note has been open and visible for DWELL_MS, once per tab session. The
// server also deduplicates per visitor per 24 hours and ignores bots.
// Returns null until a count is known, and stays null if the counter is
// missing or unreachable (e.g. under `npm start`, which has no /api), so the
// caller can simply hide it.

const ENDPOINT = '/api/views';
const DWELL_MS = 5000;
const SENT_KEY = 'fieldNoteRead:';

const readJson = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const useViewCount = (slug) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;
    let timer = null;
    setCount(null);

    // Never let a late, cached read move the number backwards.
    const show = (n) => {
      if (cancelled || !Number.isFinite(n)) return;
      setCount((prev) => (prev === null ? n : Math.max(prev, n)));
    };

    fetch(`${ENDPOINT}?slugs=${encodeURIComponent(slug)}`)
      .then(readJson)
      .then((data) => show(data.counts?.[slug]))
      .catch(() => {});

    let alreadySent = false;
    try { alreadySent = sessionStorage.getItem(SENT_KEY + slug) === '1'; } catch { /* storage blocked */ }
    if (alreadySent) return () => { cancelled = true; };

    const onVisibility = () => {
      clearTimeout(timer);
      if (document.visibilityState === 'visible') timer = setTimeout(send, DWELL_MS);
    };
    const send = () => {
      document.removeEventListener('visibilitychange', onVisibility);
      try { sessionStorage.setItem(SENT_KEY + slug, '1'); } catch { /* storage blocked */ }
      fetch(`${ENDPOINT}?slug=${encodeURIComponent(slug)}`, { method: 'POST' })
        .then(readJson)
        .then((data) => show(data.count))
        .catch(() => {});
    };

    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [slug]);

  return count;
};

export default useViewCount;
