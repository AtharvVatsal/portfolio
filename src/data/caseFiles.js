// Case files: a read-only view over the existing project records (data/projects.js). Nothing here adds facts. It derives URLs and orders what already exists, and it keeps the artifact register: the evidence filed with each case.
import { projects } from './projects';
import { blogPosts } from './blog';
import { PROJECT_LINKS } from '../config/links';

// URL slug = the record's existing projectKey (stable; no new identifiers invented).
export const caseSlug = (record) => record.projectKey;

// Year of the case, read from its reference number (AV-YYYY-NNN).
const caseYear = (record) => (record.caseNumber.match(/^AV-(\d{4})-/) || [])[1] || '';

// Links were checked on 2026-10-03. This one returned HTTP 404 (repository not public), so it is not rendered as a link anywhere in the case files.
const UNREACHABLE = new Set(['https://github.com/AtharvVatsal/keeper-raw']);

// Field notes that describe the same work in the author's own words. (blog post "Working with Himachal Police": the inter-battalion report processing system and the employee engagement surveys.)
const RELATED_NOTES = {
  phqreport: ['working-with-himachal-police-technology-for-society'],
  hppolice: ['working-with-himachal-police-technology-for-society'],
};

// Visual evidence filed with each case: screenshots, diagrams, recordings,
// photographs. None has been filed yet; every case shows a pending slot.
// To file one, add an entry, e.g.
//   keeperraw: [{ src: '/cases/keeper-raw/culling-view.webp', alt: '…', caption: '…',
//                 ratio: [16, 10], meta: '2026 · screenshot' }]
// (src may also be a Cloudinary URL; ratio is the image's real proportions.)
export const VISUAL_EVIDENCE = {
  keeperraw: [],
  drivesense: [],
  lzquant: [],
  newtonsnightmare: [],
  riskgrid: [],
  canspiracy: [],
  phqreport: [],
  hppolice: [],
};

const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
};

// External links filed with the case, labelled by what they actually are.
export const caseLinks = (record) => {
  const filed = PROJECT_LINKS[record.projectKey] || {};
  const out = [];
  const add = (href) => {
    if (!href || UNREACHABLE.has(href) || out.some((l) => l.href === href)) return;
    const host = hostOf(href);
    if (host === 'github.com') out.push({ href, label: 'Source repository', host });
    else if (host === 'linkedin.com') out.push({ href, label: 'LinkedIn post', host, note: 'LinkedIn may ask you to sign in' });
    else out.push({ href, label: 'Live application', host });
  };
  add(filed.github);
  add(filed.demo);
  add(record.liveUrl);
  return out;
};

const relatedNotes = (record) =>
  (RELATED_NOTES[record.projectKey] || [])
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((post) => ({ to: `/blog/${post.slug}`, label: 'Field note', title: post.title }));

// One numbered list of everything filed with the case, in a fixed order:
// visual evidence (or a pending slot), recorded console excerpt, links, notes.
const caseArtifacts = (record) => {
  const items = [];
  const visuals = VISUAL_EVIDENCE[record.projectKey] || [];
  if (visuals.length) visuals.forEach((v) => items.push({ kind: 'image', ...v }));
  else items.push({ kind: 'pending' });
  if (record.terminalSnippet) items.push({ kind: 'excerpt', text: record.terminalSnippet, caption: 'Console excerpt, as recorded in the case notes' });
  caseLinks(record).forEach((l) => items.push({ kind: 'link', ...l }));
  relatedNotes(record).forEach((n) => items.push({ kind: 'note', ...n }));
  return items.map((item, i) => ({ ...item, number: i + 1 }));
};

const toCaseFile = (record, index, all) => ({
  record,
  slug: caseSlug(record),
  year: caseYear(record),
  artifacts: caseArtifacts(record),
  visualCount: (VISUAL_EVIDENCE[record.projectKey] || []).length,
  linkCount: caseLinks(record).length + relatedNotes(record).length,
  prev: index > 0 ? { slug: caseSlug(all[index - 1]), title: all[index - 1].title, ref: all[index - 1].caseNumber } : null,
  next: index < all.length - 1 ? { slug: caseSlug(all[index + 1]), title: all[index + 1].title, ref: all[index + 1].caseNumber } : null,
});

// Archive order = the order of data/projects.js (no ranking or "featured" choice is made here).
export const caseFiles = projects.map(toCaseFile);

export const getCaseFile = (slug) => caseFiles.find((c) => c.slug === slug) || null;
