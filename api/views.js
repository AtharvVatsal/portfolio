// Field-note read counter: a Vercel Function backed by Upstash Redis, spoken to
// over its REST API (no client library).
//
//   GET  /api/views?slugs=a,b,c   -> { counts: { a: 12, b: 0, c: 3 } }
//   POST /api/views?slug=a        -> { slug: "a", count: 13 }
//
// What counts as a read:
// - once per visitor per note in a rolling 24 hours. A visitor is a salted
//   SHA-256 of IP + user agent; only the hash is stored, and it expires with
//   the window. No raw IP is kept.
// - only same-origin browser requests (an Origin header matching the host),
//   and never known bots, crawlers, previewers or HTTP libraries.
// - at most DAILY_BUDGET distinct notes per visitor per day, which caps what a
//   single client can write.
// The page only POSTs after the note has been open and visible for a few
// seconds (src/hooks/useViewCount.js).
//
// Environment (set by Vercel's Upstash integration, or by hand):
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
//   (or the older KV_REST_API_URL / KV_REST_API_TOKEN names)
//   VIEWS_SALT  a long random string; keeps visitor hashes unguessable.

const crypto = require('crypto');

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const SALT = process.env.VIEWS_SALT || REDIS_TOKEN || '';

const WINDOW_SECONDS = 60 * 60 * 24;
const DAILY_BUDGET = 50;
const MAX_SLUGS = 50;
const SLUG = /^[A-Za-z0-9-]{1,120}$/;
const BOT = /bot|crawl|spider|slurp|scrape|preview|facebookexternalhit|embedly|headless|lighthouse|pagespeed|curl|wget|python|axios|node-fetch|undici|go-http|java\/|okhttp|httpclient/i;

const countKey = (slug) => `views:count:${slug}`;

// Atomic: mark the visitor as seen for this note; if that is new and the
// visitor is within budget, increment. Returns the note's count either way.
// KEYS: seen marker, count, visitor budget. ARGV: window seconds, budget.
const COUNT_SCRIPT = `
if redis.call('SET', KEYS[1], '1', 'NX', 'EX', ARGV[1]) then
  local used = redis.call('INCR', KEYS[3])
  if used == 1 then redis.call('EXPIRE', KEYS[3], ARGV[1]) end
  if used <= tonumber(ARGV[2]) then return redis.call('INCR', KEYS[2]) end
end
return tonumber(redis.call('GET', KEYS[2]) or '0')
`;

const redis = async (command) => {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) throw new Error(body.error || `Redis HTTP ${res.status}`);
  return body.result;
};

const header = (req, name) => {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value || '';
};

const sameOrigin = (req) => {
  const origin = header(req, 'origin');
  if (!origin) return false;
  try { return new URL(origin).host === header(req, 'host'); } catch { return false; }
};

const visitorHash = (req) => {
  const ip = header(req, 'x-real-ip') || header(req, 'x-forwarded-for').split(',')[0].trim();
  const ua = header(req, 'user-agent');
  return crypto.createHash('sha256').update(`${SALT}|${ip}|${ua}`).digest('hex');
};

const readCounts = async (req, res) => {
  const slugs = [...new Set(String(req.query.slugs || '').split(','))].filter((s) => SLUG.test(s));
  if (slugs.length === 0 || slugs.length > MAX_SLUGS) return res.status(400).json({ error: 'Bad slugs' });

  const values = await redis(['MGET', ...slugs.map(countKey)]);
  const counts = Object.fromEntries(slugs.map((slug, i) => [slug, Number(values[i]) || 0]));
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=300');
  return res.status(200).json({ counts });
};

const recordRead = async (req, res) => {
  const slug = String(req.query.slug || '');
  if (!SLUG.test(slug)) return res.status(400).json({ error: 'Bad slug' });
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Forbidden' });

  res.setHeader('Cache-Control', 'no-store');
  if (BOT.test(header(req, 'user-agent'))) {
    const current = await redis(['GET', countKey(slug)]);
    return res.status(200).json({ slug, count: Number(current) || 0 });
  }

  const visitor = visitorHash(req);
  const count = await redis([
    'EVAL', COUNT_SCRIPT, '3',
    `views:seen:${slug}:${visitor}`, countKey(slug), `views:budget:${visitor}`,
    String(WINDOW_SECONDS), String(DAILY_BUDGET),
  ]);
  return res.status(200).json({ slug, count: Number(count) || 0 });
};

module.exports = async (req, res) => {
  if (!REDIS_URL || !REDIS_TOKEN) return res.status(503).json({ error: 'Counter not configured' });
  try {
    if (req.method === 'GET') return await readCounts(req, res);
    if (req.method === 'POST') return await recordRead(req, res);
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[views]', err.message);
    return res.status(502).json({ error: 'Counter unavailable' });
  }
};
