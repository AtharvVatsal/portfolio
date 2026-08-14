export const archiveMeta = {
  title: 'The Personal Archive of Atharv Vatsal',
  subtitle: 'Engineer · Photographer · Observer',
  version: '4.0',
  lastUpdated: '2026-07',
  documentRef: 'AV-ARCH-2026',
  classification: 'PUBLIC',
  archiveNote: 'This archive contains personal projects, field notes, and observations. Every entry is a document of something learned.',
  author: {
    name: 'Atharv Vatsal',
    location: 'Dharamshala → Vellore',
    currentFocus: 'Building systems that learn, observing systems that exist',
  },
  siteMeta: {
    description: 'Personal archive of Atharv Vatsal — engineer, photographer, and observer.',
    keywords: ['portfolio', 'AI engineer', 'photographer', 'VIT Vellore', 'machine learning', 'computer vision'],
  },
};

export const pageHeaders = {
  home: {
    type: 'ARCHIVE ENTRY',
    ref: 'AV-ARCH-HOME',
    classification: 'PUBLIC',
  },
  projects: {
    type: 'CASE FILES',
    ref: 'AV-ARCH-PROJECTS',
    classification: 'PUBLIC',
    note: 'Each project is a document of a problem explored.',
  },
  blog: {
    type: 'FIELD NOTES',
    ref: 'AV-ARCH-BLOG',
    classification: 'PUBLIC',
    note: 'Writing is how I think. These are my thinking-out-loud documents.',
  },
  gallery: {
    type: 'OBSERVATION LOG',
    ref: 'AV-ARCH-GALLERY',
    classification: 'PUBLIC',
    note: 'Photography is practice in seeing. These are the results.',
  },
  resume: {
    type: 'GROWTH RECORD',
    ref: 'AV-ARCH-RESUME',
    classification: 'PUBLIC',
    note: 'Not a list of achievements. A record of where I have been and what I learned.',
  },
};

export const footerMeta = {
  revisionHistory: [
    { version: '4.0', date: '2026-07', note: 'The Personal Archive — complete redesign' },
    { version: '3.0', date: '2026-03', note: 'The Engineer\'s Notebook — notebook aesthetic' },
    { version: '2.0', date: '2025-09', note: 'Dark minimal — first major redesign' },
    { version: '1.0', date: '2025-01', note: 'Initial launch — standard developer portfolio' },
  ],
  buildNote: 'Built with React. Deployed from a single terminal command. No page-builders, no drag-and-drop.',
};
