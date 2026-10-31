// Link previews (runs after `react-scripts build`; see the "build" script in
// package.json).
//
// WhatsApp, Facebook, LinkedIn, X, Slack, Discord and the like read a page's
// <meta> tags without running JavaScript, so the tags <SEO> sets in the browser
// never reach them: they see only the HTML file the host serves. This sets the
// cards in those files:
//
// - every route: build/index.html carries the site card, public/og-photo.webp
//   (as a JPEG: not every platform takes WebP). The host serves this file for
//   any path that has no file of its own.
// - /gallery: build/gallery/index.html carries the featured photograph, the
//   first record marked `featured: true` in src/data/gallery.js (also the home
//   hero), cropped by Cloudinary.
// - /blog/<slug>: build/blog/<slug>/index.html for every note in
//   src/data/blog.js carries its title, excerpt, date and cover. A note without
//   a cover keeps the site card.
//
// Each of these files is the same app shell; the page boots exactly as before.
// Local images are cropped to 1200 × 630 (the 1.91:1 card every platform uses)
// as JPEGs under 300 KB (WhatsApp drops larger previews) in build/og/, named
// with a hash of their source, so a replaced image is fetched afresh rather
// than served from a platform's cache.
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
const SITE_IMAGE = '/og-photo.webp';
const CLOUDINARY = 'https://res.cloudinary.com/dg5o8qvwp/image/upload'; // src/config/cloudinary.js
// The gallery's title and description, as GalleryPage.jsx's <SEO> sets them.
const GALLERY = {
  title: 'Observations',
  description: 'Observation log by Atharv Vatsal — landscapes, wildlife, concerts, street photography.',
};
const CARD = { width: 1200, height: 630 };
const MAX_BYTES = 300 * 1024;

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const PUBLIC = path.join(ROOT, 'public');

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The data files are ES modules: load one as a data: URL, with its relative
// imports (other data and config files) loaded the same way. No bundler needed.
function moduleUrl(file) {
  const source = fs.readFileSync(file, 'utf8').replace(/from\s+(['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, spec) => {
    const base = path.resolve(path.dirname(file), spec);
    const target = [base, `${base}.js`, path.join(base, 'index.js')].find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
    if (!target) throw new Error(`${path.relative(ROOT, file)}: cannot resolve ${spec}`);
    return `from ${q}${moduleUrl(target)}${q}`;
  });
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
}
const loadModule = (rel) => import(moduleUrl(path.join(ROOT, rel)));

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

function setPage(html, { title, description, type, url }) {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title === SITE_NAME ? title : `${title} | ${SITE_NAME}`)}</title>`);
  out = setMeta(out, 'description', description);
  out = setMeta(out, 'og:type', type);
  out = setMeta(out, 'og:title', title);
  out = setMeta(out, 'og:description', description);
  out = setMeta(out, 'og:url', url);
  out = setMeta(out, 'twitter:title', title);
  out = setMeta(out, 'twitter:description', description);
  return out;
}

function setImage(html, card, alt) {
  let out = setMeta(html, 'og:image', card.url);
  out = setMeta(out, 'twitter:image', card.url);
  out = setMeta(out, 'og:image:alt', alt);
  out = setMeta(out, 'twitter:image:alt', alt);
  if (card.width) {
    out = setMeta(out, 'og:image:type', 'image/jpeg');
    out = setMeta(out, 'og:image:width', String(card.width));
    out = setMeta(out, 'og:image:height', String(card.height));
  } else {
    // An unprocessed original: its size and type are not known here, so claim none.
    out = removeMeta(out, 'og:image:type');
    out = removeMeta(out, 'og:image:width');
    out = removeMeta(out, 'og:image:height');
  }
  return out;
}

// Write build/<route>/index.html, unless a folder copied from public/ is
// already there (the route would shadow its files).
function writePage(route, html) {
  const dir = path.join(BUILD, route);
  if (fs.existsSync(dir) && !fs.existsSync(path.join(dir, 'index.html'))) {
    console.warn(`  ! /${route}: build/${route}/ already exists (from public/), skipped`);
    return false;
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return true;
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
  // Without sharp the original image is used as is (still a valid preview).
}

// A public/ image -> a 1200 × 630 JPEG card in build/og/<folder>/.
async function makeCard(publicPath, folder, name, cssPosition) {
  const file = path.join(PUBLIC, decodeURI(publicPath));
  if (!fs.existsSync(file)) return null;
  if (!sharp) return { url: `${ORIGIN}${encodeURI(decodeURI(publicPath))}` };

  const position = cropPosition(cssPosition);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).update(position).digest('hex').slice(0, 10);
  const fileName = `${name}-${hash}.jpg`;
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
  const dir = path.join(BUILD, 'og', folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, fileName), data);
  const { width } = await sharp(file).metadata();
  return { url: `${ORIGIN}/og/${folder}/${fileName}`, ...CARD, bytes: data.length, upscaled: width < CARD.width };
}

const describe = (card) =>
  card.bytes
    ? `${Math.round(card.bytes / 1024)} KB${card.upscaled ? ' (source narrower than 1200px, enlarged)' : ''}`
    : 'original image';

async function main() {
  const shellPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(shellPath)) throw new Error('build/index.html not found: run react-scripts build first');
  if (!sharp) console.warn('  ! sharp is not installed: images are used uncropped');
  console.log('Link previews');

  // 1. The site card, on build/index.html: every route without a page of its own.
  const siteCard = await makeCard(SITE_IMAGE, 'site', 'atharv-vatsal');
  if (!siteCard) throw new Error(`public${SITE_IMAGE} not found`);
  const shell = setImage(fs.readFileSync(shellPath, 'utf8'), siteCard, `${SITE_NAME}: personal archive`);
  fs.writeFileSync(shellPath, shell);
  console.log(`  every route  site card, ${describe(siteCard)}`);

  // 2. The gallery: its featured photograph.
  const { galleryPhotos } = await loadModule('src/data/gallery.js');
  const featured = galleryPhotos.find((p) => p.featured) || galleryPhotos[0];
  let html = setPage(shell, { ...GALLERY, type: 'website', url: `${ORIGIN}/gallery` });
  if (featured) {
    html = setImage(
      html,
      { url: `${CLOUDINARY}/w_${CARD.width},h_${CARD.height},c_fill,g_auto,q_auto:good,f_jpg/${featured.publicId}`, ...CARD },
      `${featured.title}, photographed by ${SITE_NAME}${featured.location ? ` in ${featured.location}` : ''}`,
    );
  }
  if (writePage('gallery', html)) console.log(`  /gallery  ${featured ? `“${featured.title}” (Cloudinary)` : 'site card'}`);

  // 3. Field notes: their covers.
  const { blogPosts } = await loadModule('src/data/blog.js');
  for (const post of blogPosts) {
    let page = setPage(shell, { title: post.title, description: post.excerpt, type: 'article', url: `${ORIGIN}/blog/${post.slug}` });
    const published = isoDate(post.date);
    if (published) page = setMeta(page, 'article:published_time', published);

    let card = null;
    if (post.coverImage) {
      card = await makeCard(post.coverImage, 'blog', post.slug, post.coverPosition);
      if (!card) console.warn(`  ! ${post.slug}: cover ${post.coverImage} is not in public/, so the site card is used`);
    }
    if (card) page = setImage(page, card, `Cover of the field note “${post.title}”`);
    if (writePage(path.join('blog', post.slug), page)) {
      console.log(`  /blog/${post.slug}  ${card ? describe(card) : 'site card (no cover)'}`);
    }
  }
}

main().catch((err) => {
  console.error('Link previews failed:', err);
  process.exit(1);
});
