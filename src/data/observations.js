// Observations: a read-only view over the photographs in data/gallery.js.
// Nothing here adds facts about a photograph. It derives the archive number,
// a readable date, the place, the subject filters and responsive image
// URLs, and it carries the photographs' measured proportions.
import { galleryPhotos } from './gallery';
import { getCloudinaryUrl } from '../config/cloudinary';

// Real pixel size of each Cloudinary original, measured 2026-10-04
// (fl_getinfo; the delivered w_800 thumbnails agree). The `aspectRatio`
// strings in gallery.js disagree for No. 001, 005, 010 and 020 and are
// missing for No. 003, so layout uses these numbers instead.
const MEASURED = {
  1: [4000, 6000], 2: [4000, 6000], 3: [6048, 4032], 4: [6048, 4032],
  5: [6000, 4000], 6: [667, 1000], 7: [3593, 2206], 8: [4000, 6000],
  9: [6000, 4000], 10: [6000, 4000], 11: [6000, 4000], 12: [6000, 4000],
  13: [2936, 4608], 14: [4000, 6000], 15: [2296, 4080], 16: [1080, 1920],
  17: [6000, 4000], 18: [4894, 3263], 19: [4000, 6000], 20: [6000, 4000],
  21: [6000, 4000], 22: [5734, 3823],
  // No. 023-041 measured 2026-10-06 (fl_getinfo).
  23: [2777, 2222], 24: [5734, 3823], 25: [6048, 4032], 26: [6000, 4000],
  27: [8256, 5504], 28: [5514, 3676], 29: [6000, 4000], 30: [5653, 3769],
  31: [6000, 4000], 32: [5259, 3506], 33: [6000, 4000], 34: [6048, 4032],
  35: [3335, 5003], 36: [2895, 4342], 37: [3282, 4923], 38: [4032, 6048],
  39: [5393, 3618], 40: [6048, 4032], 41: [6048, 4032],
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// gallery.js records dates as DD-MM-YYYY (e.g. 17-11-2023, 28-02-2024) and
// once as ISO YYYY-MM-DD (2024-10-05). Both are read; nothing is guessed.
const readDate = (raw) => {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw || '');
  const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(raw || '');
  if (!iso && !dmy) return null;
  const [y, m, d] = iso ? [iso[1], iso[2], iso[3]] : [dmy[3], dmy[2], dmy[1]];
  return {
    year: y,
    sort: `${y}${m}${d}`,
    iso: `${y}-${m}-${d}`,
    label: `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`,
  };
};

const pad = (n) => String(n).padStart(3, '0');

const imageSet = (publicId, widths) => ({
  src: getCloudinaryUrl(publicId, { width: widths[1] || widths[0], quality: 'auto:good' }),
  srcSet: widths.map((w) => `${getCloudinaryUrl(publicId, { width: w, quality: 'auto:good' })} ${w}w`).join(', '),
});

const categoryNames = new Set(galleryPhotos.map((p) => p.category));

// A combined category ("Concert/Crowd") counts under each of its parts when
// every part is itself an existing category; otherwise it stays as written.
const subjectsOf = (category) => {
  const parts = category.split('/').map((s) => s.trim());
  return parts.length > 1 && parts.every((s) => categoryNames.has(s)) ? parts : [category];
};

// One line of exposure settings, in the order a photographer reads them.
const exposureOf = (s = {}) =>
  [s.focalLength, s.aperture, s.shutter, s.iso && `ISO ${s.iso}`].filter(Boolean);

export const observations = galleryPhotos
  .map((p) => {
    // The wall's column geometry is computed from these sizes, so a photograph
    // without one is laid out as 3:2 until it is measured.
    if (!MEASURED[p.id] && process.env.NODE_ENV !== 'production') {
      console.warn(`observations.js: No. ${pad(p.id)} has no measured size in MEASURED (fl_getinfo on ${p.publicId}).`);
    }
    const [width, height] = MEASURED[p.id] || [3, 2];
    return {
      ...p,
      number: `No. ${pad(p.id)}`,
      width,
      height,
      ratio: width / height,
      orientation: width > height * 1.05 ? 'landscape' : height > width * 1.05 ? 'portrait' : 'square',
      when: readDate(p.date),
      subjects: subjectsOf(p.category),
      exposure: exposureOf(p.settings),
      place: (p.location || '').split(',')[0].trim(),
      field: imageSet(p.publicId, [400, 640, 960]),
      view: imageSet(p.publicId, [960, 1440, 1920, 2560]),
    };
  })
  // Newest first; photographs from the same day keep their archive order.
  .sort((a, b) => (b.when?.sort || '').localeCompare(a.when?.sort || '') || a.id - b.id);

const years = [...new Set(observations.map((o) => o.when?.year).filter(Boolean))].sort();
export const archiveSpan = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0] || '';

// Subjects with at least two photographs become filters. A subject with a
// single photograph is still printed on its frame and listed beside the
// filters; filtering down to one frame is not navigation.
const counts = observations.reduce((acc, o) => {
  o.subjects.forEach((s) => { acc[s] = (acc[s] || 0) + 1; });
  return acc;
}, {});

export const subjectFilters = Object.entries(counts)
  .filter(([, n]) => n >= 2)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count }));

export const singleSubjects = Object.entries(counts)
  .filter(([, n]) => n === 1)
  .map(([name]) => name)
  .sort();

// Cameras recorded across the archive, most used first (from the `camera` field).
export const camerasOnRecord = Object.entries(
  observations.reduce((acc, o) => {
    if (o.camera) acc[o.camera] = (acc[o.camera] || 0) + 1;
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name]) => name);
