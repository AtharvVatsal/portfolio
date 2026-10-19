// Case files: a read-only view over the existing project records (data/projects.js).
// Nothing here adds facts. It derives URLs and orders what already exists, and it
// keeps the artifact register: the evidence filed with each case.
import { projects } from './projects';
import { blogPosts } from './blog';
import { PROJECT_LINKS } from '../config/links';

// URL slug = the record's existing projectKey (stable; no new identifiers invented).
export const caseSlug = (record) => record.projectKey;

// Year of the case, read from its reference number (AV-YYYY-NNN).
const caseYear = (record) => (record.caseNumber.match(/^AV-(\d{4})-/) || [])[1] || '';

// Links on record that cannot be opened publicly are listed here and never
// rendered as links (case files, and the résumé via isPublicLink). Checked
// 2026-10-05: every project link on record resolves. (The keeper repository
// had been filed as `keeper-raw`, which returned 404; the owner confirmed the
// public repository is `keeper.raw`, and the record now points there.)
const UNREACHABLE = new Set([]);
export const isPublicLink = (url) => Boolean(url) && !UNREACHABLE.has(url);

// Projects the owner has confirmed are private (2026-10-05): nothing from them
// is public, so no evidence is requested and none is implied.
export const PRIVATE_PROJECTS = new Set(['hppolice']);

// Field notes that describe the same work in the author's own words.
// (blog post "Working with Himachal Police": the inter-battalion report
// processing system and the employee engagement surveys.)
const RELATED_NOTES = {
  phqreport: ['working-with-himachal-police-technology-for-society'],
  hppolice: ['working-with-himachal-police-technology-for-society'],
};

// Visual evidence filed with each case. Every item is a real artifact the
// owner published in the project's own repository (owner's permission,
// 2026-10-05); `source` is the file it came from.
//   original  the file exactly as published (byte-identical copy), opened
//             by the "full size" link
//   src/srcSet presentation copies derived from it: resized WebP, no cropping
//             or other change (docs/PHASE-11-OWNER-QUESTIONS.md §7)
//   ratio     the original's pixel size
const CF = '/Case%20Files';
const filed = (dir, stem, widths, original, rest) => ({
  src: `${CF}/${dir}/${stem}-${widths[widths.length - 1]}.webp`,
  srcSet: widths.map((w) => `${CF}/${dir}/${stem}-${w}.webp ${w}w`).join(', '),
  sizes: '(min-width: 1280px) 1100px, 100vw',
  href: `${CF}/${dir}/original/${original}`,
  original: `${dir}/original/${original}`,
  ...rest,
});
export const VISUAL_EVIDENCE = {
  keeperraw: [
    filed('keeper.raw', 'screenshot_cull', [800, 1600], 'screenshot_cull.png', {
      alt: 'keeper.raw after a cull: 20 RAW files grouped into 11 scenes, each frame marked keeper or reject',
      caption: 'The cull view after a run: "Cull complete in 133.2s · 20 images → 11 scenes · 11 keepers · 3 rejects · 6 unrated". Screenshot from the project repository, docs/screenshots/screenshot_cull.png.',
      meta: 'Screenshot · 2026-04-01',
      ratio: [2559, 1438],
      source: 'https://github.com/AtharvVatsal/keeper.raw/blob/master/docs/screenshots/screenshot_cull.png',
    }),
  ],
  drivesense: [
    filed('DriveSense', 'result_0484_b2e96aa8-4d92cdf0', [800], 'result_0484_b2e96aa8-4d92cdf0.jpg', {
      alt: 'A road frame from DriveSense: YOLOv8 boxes with class labels and confidences over the U-Net class map',
      caption: 'Both pipelines on one frame: YOLOv8 detections (cars, traffic lights, traffic signs, with confidences) drawn over the U-Net class map, with the HUD\'s FPS and detection count. From the repository\'s sample output, results/sample_output/result_0484_b2e96aa8-4d92cdf0.jpg.',
      meta: 'Sample output',
      ratio: [1280, 720],
      source: 'https://github.com/AtharvVatsal/DriveSense/blob/main/results/sample_output/result_0484_b2e96aa8-4d92cdf0.jpg',
    }),
    filed('DriveSense', 'performance_chart', [800, 1600], 'performance_chart.png', {
      alt: 'DriveSense performance metrics: inference speed per image, processing time per stage, detections per image, and summary statistics',
      caption: 'Over 20,000 images: average 14.14 FPS and 331,998 detections (16.6 per image); segmentation takes most of each frame\'s processing time. Chart from the repository, results/metrics/performance_chart.png.',
      meta: 'Evaluation chart',
      ratio: [4465, 2947],
      source: 'https://github.com/AtharvVatsal/DriveSense/blob/main/results/metrics/performance_chart.png',
    }),
  ],
  lzquant: [],
  newtonsnightmare: [],
  riskgrid: [
    filed('RiskGrid', 'grid_visualization', [800, 1600], 'grid_visualization.png', {
      alt: 'RiskGrid spatial-temporal analysis: crime density heatmap over the grid, the ten busiest cells, grid statistics, and daily and hourly trends',
      caption: 'Crime density per grid cell across all years, the ten busiest cells, and daily and hourly distributions. The figure\'s own statistics read 3,199 grid cells and 8,327,493 incidents. A static chart from the repository, outputs/grid_visualization.png; the interactive Folium map is still requested below.',
      meta: 'Analysis figure',
      ratio: [4485, 3384],
      source: 'https://github.com/AtharvVatsal/RiskGrid/blob/main/outputs/grid_visualization.png',
    }),
    filed('RiskGrid', 'temporal_patterns', [800, 1600], 'temporal_patterns.png', {
      alt: 'RiskGrid temporal analysis: incidents by year, by month, by hour of day and by day of week',
      caption: 'Incidents by year (2001–2025), month, hour of day and weekday. From the repository, outputs/temporal_patterns.png.',
      meta: 'Analysis figure',
      ratio: [4471, 2955],
      source: 'https://github.com/AtharvVatsal/RiskGrid/blob/main/outputs/temporal_patterns.png',
    }),
  ],
  canspiracy: [
    filed('TheCanspiracy', 'results', [800, 1600], 'results.png', {
      alt: 'Training curves for The Canspiracy\'s YOLOv8 run 2: losses, precision, recall, mAP50 and mAP50-95 over 125 epochs',
      caption: 'YOLOv8 training run 2, 125 epochs: the losses fall and mAP50 levels off near 0.94 (0.941 at the final epoch in the run\'s results.csv). From the repository, YOLO-Training-Results/YOLO-Training-2/runs/detect/train/results.png.',
      meta: 'Training log · run 2',
      ratio: [2400, 1200],
      source: 'https://github.com/AtharvVatsal/TheCanspiracy/blob/main/YOLO-Training-Results/YOLO-Training-2/runs/detect/train/results.png',
    }),
    // Phase 12: replaces the run-2 confusion matrix, withdrawn because its class
    // labels include one the owner does not want shown publicly. This curve, from
    // the same run and folder, carries no class names.
    filed('TheCanspiracy', 'PR_curve', [800, 1600], 'PR_curve.png', {
      alt: 'Precision-recall curve for The Canspiracy\'s YOLOv8 run 2: one unlabelled curve per class and the all-classes curve, 0.940 mAP@0.5',
      caption: 'Precision against recall for every class (grey) and for all classes together (blue, "all classes 0.940 mAP@0.5" in the figure\'s legend; the run\'s results.csv records 0.941 at the final epoch). From the repository, YOLO-Training-Results/YOLO-Training-2/runs/detect/train/PR_curve.png.',
      meta: 'Training log · run 2',
      ratio: [2250, 1500],
      source: 'https://github.com/AtharvVatsal/TheCanspiracy/blob/main/YOLO-Training-Results/YOLO-Training-2/runs/detect/train/PR_curve.png',
    }),
  ],
  phqreport: [],
  hppolice: [],
};

// Evidence each case still needs: one slot per artifact that would show a
// feature the record already describes (the record's own words are cited in
// `from`). These are requests to the author, rendered as empty, labelled
// slots - never as stand-in images. A request is removed once an artifact
// that actually shows it is filed in VISUAL_EVIDENCE. Private projects get none.
export const EVIDENCE_REQUESTS = {
  keeperraw: [
    { title: 'The exported XMP ratings, opened in Lightroom', from: 'outcome: "exports directly to Lightroom-compatible format"' },
  ],
  drivesense: [],
  lzquant: [
    { title: 'A paper-trading run: sentiment against price, with divergence signals', from: 'outcome: "Paper trading engine demonstrates sentiment-price divergence strategies"' },
  ],
  newtonsnightmare: [
    { title: 'A trained Ant agent walking (recording, or its training reward curve)', from: 'outcome: "Ant agent learns to walk in ~500K steps"' },
  ],
  riskgrid: [
    { title: 'The Folium hotspot heatmap on the 100m grid', from: 'pipeline: "Prediction → Folium heatmap"' },
  ],
  canspiracy: [
    { title: 'A detection frame: cans with boxes and confidence scores', from: 'approach: "bounding boxes, confidence scores, and class labels"' },
    { title: 'The Tkinter GUI with its four input sources', from: 'approach: "single images, video files, webcam feed, and DroidCam mobile camera stream"' },
  ],
  phqreport: [
    { title: 'A report and its structured output in the parser (v1 Streamlit or v4 desktop; personal details redacted)', from: 'approach: "Outputs to Excel, CSV, and JSON formats"' },
  ],
  hppolice: [],
};

// Project identity marks filed in the repository. A mark shows the project's
// name as designed - it is identity, not evidence of what the software does.
export const PROJECT_MARKS = {
  keeperraw: {
    src: `${CF}/keeper.raw/keeper-white.png`,
    alt: 'keeper.raw',
    ratio: [595, 223],
    caption: 'Project wordmark, as filed in the repository',
  },
};

// Before → after measures, quoted from the record's own text (field cited in
// `source`). Nothing is computed or rounded here.
export const MEASURED_CHANGES = {
  keeperraw: [{ measure: 'Culling time, typical wedding shoot', before: '8+ hours', after: 'approximately 30 minutes', source: 'Outcome (measured in real use, per the author)' }],
  drivesense: [{ measure: 'Detection mAP, 50-epoch YOLOv8m run (console excerpt)', before: '0.112', after: '0.556', source: 'Console excerpt (epoch 1 → epoch 50 of the 50-epoch run)' }],
  lzquant: [{ measure: 'Sentiment accuracy, keyword analyser → fine-tuned DistilBERT', before: '58%', after: '84%', source: 'Revision note' }],
  phqreport: [
    { measure: 'Report processing time per batch (version 1)', before: '2 hours', after: '15 minutes', source: 'Outcome' },
    { measure: 'Processing time per report (version 4)', before: '15–20 minutes', after: 'seconds', source: 'Outcome' },
  ],
};

// Points on record that are still open, shown on the case so nothing reads as
// settled. (The six Phase 9 conflicts were answered by the owner on
// 2026-10-05 and removed; these were found while applying those answers.)
export const RECORD_NOTES = {
  drivesense: ['The console excerpt is from a 50-epoch YOLOv8m run that is not in the project repository; the repository documents its 55.6% mAP@0.5 for a separate 100-epoch YOLOv8n run.'],
  riskgrid: ['The current résumé lists RiskGrid under the May–July 2025 HP Police internship; this record dates it October 2025 as academic work.'],
};

// Captions for recorded console output that needs more than the default.
const EXCERPT_CAPTIONS = {
  drivesense: 'Console excerpt from a 50-epoch YOLOv8m run, as recorded in the case notes. It is not the 100-epoch YOLOv8n run behind the 55.6% mAP@0.5 in the project\'s documentation.',
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

// Everything filed with a case, numbered once in a fixed order:
//   evidence  visual records filed (image), then the slots still requested (pending)
//   excerpts  recorded console output
//   records   external records (repository, post, app) and related field notes
const caseArtifacts = (record) => {
  const key = record.projectKey;
  const evidence = [
    ...(VISUAL_EVIDENCE[key] || []).map((v) => ({ kind: 'image', ...v })),
    ...(EVIDENCE_REQUESTS[key] || []).map((r) => ({ kind: 'pending', ...r })),
  ];
  const excerpts = record.terminalSnippet
    ? [{ kind: 'excerpt', text: record.terminalSnippet, caption: EXCERPT_CAPTIONS[record.projectKey] || 'Console excerpt, as recorded in the case notes' }]
    : [];
  const records = [
    ...caseLinks(record).map((l) => ({ kind: 'link', ...l })),
    ...relatedNotes(record).map((n) => ({ kind: 'note', ...n })),
  ];
  // Numbered in the order the case file shows them: filed visual records,
  // recorded output, requested slots, then external records and notes.
  let n = 0;
  const number = (list) => list.map((item) => ({ ...item, number: (n += 1) }));
  const visuals = number(evidence.filter((a) => a.kind === 'image'));
  const numberedExcerpts = number(excerpts);
  const requests = number(evidence.filter((a) => a.kind === 'pending'));
  return { evidence: [...visuals, ...requests], excerpts: numberedExcerpts, records: number(records) };
};

// Links on record that cannot be opened publicly (see UNREACHABLE).
const unreachableLinks = (record) => {
  const filed = PROJECT_LINKS[record.projectKey] || {};
  return [...new Set([filed.github, filed.demo, record.liveUrl].filter((u) => u && UNREACHABLE.has(u)))];
};

// Evidence status, derived from what is actually filed (never set by hand):
//   PRIVATE PROJECT    owner-confirmed private; nothing public is implied
//   COMPLETE           visual evidence filed and no request outstanding
//   PARTIAL            visual evidence filed, some still requested
//   AWAITING EVIDENCE  nothing visual filed; requests outstanding
//   TEXT-ONLY          nothing visual filed and nothing requested
export const EVIDENCE_STATUSES = ['COMPLETE', 'PARTIAL', 'TEXT-ONLY', 'AWAITING EVIDENCE', 'PRIVATE PROJECT'];
const evidenceStatus = (key) => {
  const visuals = (VISUAL_EVIDENCE[key] || []).length;
  const requests = (EVIDENCE_REQUESTS[key] || []).length;
  if (PRIVATE_PROJECTS.has(key)) return 'PRIVATE PROJECT';
  if (visuals && !requests) return 'COMPLETE';
  if (visuals) return 'PARTIAL';
  return requests ? 'AWAITING EVIDENCE' : 'TEXT-ONLY';
};

const toCaseFile = (record, index, all) => {
  const key = record.projectKey;
  const { evidence, excerpts, records } = caseArtifacts(record);
  const mark = PROJECT_MARKS[key] || null;
  return {
    privateProject: PRIVATE_PROJECTS.has(key),
    evidenceStatus: evidenceStatus(key),
    record,
    slug: caseSlug(record),
    year: caseYear(record),
    mark,
    evidence,
    excerpts,
    records,
    measures: MEASURED_CHANGES[key] || [],
    recordNotes: RECORD_NOTES[key] || [],
    visualCount: (VISUAL_EVIDENCE[key] || []).length,
    requestCount: (EVIDENCE_REQUESTS[key] || []).length,
    // The strongest real artifact on file, for previews (home, register):
    // a visual record, else the project mark, else a recorded excerpt.
    leadArtifact: evidence.find((a) => a.kind === 'image')
      || (mark && { kind: 'mark', ...mark })
      || excerpts[0]
      || null,
    linkCount: records.length,
    unreachable: unreachableLinks(record),
    prev: index > 0 ? { slug: caseSlug(all[index - 1]), title: all[index - 1].title, ref: all[index - 1].caseNumber } : null,
    next: index < all.length - 1 ? { slug: caseSlug(all[index + 1]), title: all[index + 1].title, ref: all[index + 1].caseNumber } : null,
  };
};

// Archive order = the order of data/projects.js (no ranking or "featured" choice is made here).
export const caseFiles = projects.map(toCaseFile);

export const getCaseFile = (slug) => caseFiles.find((c) => c.slug === slug) || null;
