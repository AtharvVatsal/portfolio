import { useEffect, useState } from 'react';

// Field-note read counts, from the counter at /api/views (api/views.js).
//
// useViewCount(slug), for the note being read: the count is fetched on
// arrival; the read itself is recorded only after the note has been open and
// visible for DWELL_MS, once per tab session. The server also deduplicates per
// visitor per 24 hours and ignores bots. Returns null until a count is known.
//
// useViewCounts(slugs), for lists: one request for every count, recording
// nothing. Returns { slug: count }, empty until the counts arrive.
//
// Both stay empty if the counter is missing or unreachable (e.g. under
// `npm start`, which has no /api), so callers can simply hide the count.

const ENDPOINT = '/api/views';
const DWELL_MS = 5000;
const SENT_KEY = 'fieldNoteRead:';

const readJson = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const fetchCounts = (slugs) => fetch(`${ENDPOINT}?slugs=${slugs.map(encodeURIComponent).join(',')}`)
  .then(readJson)
  .then((data) => data.counts || {});

export const useViewCounts = (slugs) => {
  const key = slugs.join(',');
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    fetchCounts(key.split(','))
      .then((result) => { if (!cancelled) setCounts(result); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [key]);

  return counts;
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

    fetchCounts([slug])
      .then((counts) => show(counts[slug]))
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
