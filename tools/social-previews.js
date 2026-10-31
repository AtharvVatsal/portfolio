// Link previews for field notes (runs after `react-scripts build`; see the
// "build" script in package.json).
//
// WhatsApp, Facebook, LinkedIn, X, Slack, Discord and the like read a page's
// <meta> tags without running JavaScript, so the tags <SEO> sets in the browser
// never reach them: every URL would show build/index.html's site-wide card.
// This writes build/blog/<slug>/index.html for every note in src/data/blog.js:
// the same app shell (the page boots exactly as before), with the note's title,
// excerpt, date and cover in its tags. The host serves that file for
// /blog/<slug> ahead of its fallback to index.html.
//
// Each cover is cropped to 1200 × 630 (the 1.91:1 card every platform uses,
// following the note's coverPosition) and saved as a JPEG under 300 KB
// (WhatsApp drops larger previews) at build/og/blog/<slug>-<hash>.jpg. The hash
// changes with the cover, so a replaced cover is fetched afresh rather than
// served from a platform's cache. A note without a cover keeps the site card.
//
// Nothing to do per note: add it to blog.js with a coverImage and the next
// build makes its preview.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// The address the site is served from. The bare domain answers with a 308 to
// www, and preview crawlers should not have to follow a redirect for the image.
const ORIGIN = 'https://www.atharvvatsal.com';
const SITE_NAME = 'Atharv Vatsal';
const CARD = { width: 1200, height: 630 };
const MAX_BYTES = 300 * 1024;

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const PUBLIC = path.join(ROOT, 'public');

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// blog.js is an ES module with no imports: load it as one, without a bundler.
async function loadPosts() {
  const source = fs.readFileSync(path.join(ROOT, 'src/data/blog.js'), 'utf8');
  const mod = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  if (!Array.isArray(mod.blogPosts)) throw new Error('src/data/blog.js does not export blogPosts');
  return mod.blogPosts;
}

// Replace a <meta> tag (matched by its property or name), or add it before </head>.
function setMeta(html, key, content) {
  const attr = /^(og|article):/.test(key) ? 'property' : 'name';
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}"/>`;
  const re = new RegExp(`<meta[^>]*\\b(?:property|name)="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}</head>`);
}

function removeMeta(html, key) {
  return html.replace(new RegExp(`<meta[^>]*\\b(?:property|name)="${key}"[^>]*>`, 'g'), '');
}

// CSS object-position keywords ("center bottom") -> a sharp crop position.
function cropPosition(css) {
  const words = String(css || '').toLowerCase().split(/\s+/);
  const x = words.find((w) => w === 'left' || w === 'right');
  const y = words.find((w) => w === 'top' || w === 'bottom');
  return [x, y].filter(Boolean).join(' ') || 'centre';
}

// "31-10-2026" -> "2026-10-31"
function isoDate(ddmmyyyy) {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(ddmmyyyy || '');
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

let sharp = null;
try {
  sharp = require('sharp');
} catch {
  // Without sharp the original cover is used as is (still a valid preview).
}

async function makeCard(post) {
  const file = path.join(PUBLIC, decodeURI(post.coverImage));
  if (!fs.existsSync(file)) {
    console.warn(`  ! ${post.slug}: cover ${post.coverImage} is not in public/, so the site card is used`);
    return null;
  }
  if (!sharp) return { url: `${ORIGIN}${encodeURI(decodeURI(post.coverImage))}` };

  const position = cropPosition(post.coverPosition);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).update(position).digest('hex').slice(0, 10);
  const name = `${post.slug}-${hash}.jpg`;
  let data;
  for (const quality of [82, 74, 66, 58]) {
    data = await sharp(file)
      .rotate()
      .resize(CARD.width, CARD.height, { fit: 'cover', position })
      .flatten({ background: '#0a0908' })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (data.length <= MAX_BYTES) break;
  }
  const dir = path.join(BUILD, 'og', 'blog');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), data);
  const { width } = await sharp(file).metadata();
  return { url: `${ORIGIN}/og/blog/${name}`, ...CARD, type: 'image/jpeg', bytes: data.length, upscaled: width < CARD.width };
}

async function main() {
  const shellPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(shellPath)) throw new Error('build/index.html not found: run react-scripts build first');
  const shell = fs.readFileSync(shellPath, 'utf8');
  const posts = await loadPosts();
  if (!sharp) console.warn('  ! sharp is not installed: covers are used uncropped');

  console.log(`Link previews for ${posts.length} field notes`);
  for (const post of posts) {
    const outDir = path.join(BUILD, 'blog', post.slug);
    if (fs.existsSync(outDir) && !fs.existsSync(path.join(outDir, 'index.html'))) {
      // A folder of the same name came from public/blog/: don't shadow its files' route.
      console.warn(`  ! ${post.slug}: build/blog/${post.slug}/ already exists (from public/), skipped`);
      continue;
    }

    const url = `${ORIGIN}/blog/${post.slug}`;
    const title = `${post.title} | ${SITE_NAME}`;
    let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
    html = setMeta(html, 'description', post.excerpt);
    html = setMeta(html, 'og:type', 'article');
    html = setMeta(html, 'og:title', post.title);
    html = setMeta(html, 'og:description', post.excerpt);
    html = setMeta(html, 'og:url', url);
    html = setMeta(html, 'twitter:title', post.title);
    html = setMeta(html, 'twitter:description', post.excerpt);
    const published = isoDate(post.date);
    if (published) html = setMeta(html, 'article:published_time', published);

    const card = post.coverImage ? await makeCard(post) : null;
    if (card) {
      html = setMeta(html, 'og:image', card.url);
      html = setMeta(html, 'twitter:image', card.url);
      html = setMeta(html, 'og:image:alt', `Cover of the field note “${post.title}”`);
      html = setMeta(html, 'twitter:image:alt', `Cover of the field note “${post.title}”`);
      if (card.width) {
        html = setMeta(html, 'og:image:type', card.type);
        html = setMeta(html, 'og:image:width', String(card.width));
        html = setMeta(html, 'og:image:height', String(card.height));
      } else {
        // Uncropped original: its size is unknown here, so claim none.
        html = removeMeta(html, 'og:image:width');
        html = removeMeta(html, 'og:image:height');
      }
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    const note = !post.coverImage
      ? 'no cover, site card'
      : card?.bytes
        ? `${Math.round(card.bytes / 1024)} KB${card.upscaled ? ' (cover narrower than 1200px, enlarged)' : ''}`
        : card ? 'original cover' : 'site card';
    console.log(`  /blog/${post.slug}  ${note}`);
  }
}

main().catch((err) => {
  console.error('Link previews failed:', err);
  process.exit(1);
});
