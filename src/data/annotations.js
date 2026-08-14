export const annotations = {
  sections: {
    hero: [
      {
        id: 'hero-1',
        text: 'The archive opens. Name appears later.',
        position: 'margin',
        side: 'right',
      },
      {
        id: 'hero-2',
        text: 'Still updating this section. The intro is never quite right. Need to revisit after my next project ships.',
        position: 'margin',
        side: 'left',
      },
    ],
    about: [
      {
        id: 'about-1',
        text: 'Still thinking about this — curiosity is hard to explain without sounding rehearsed.',
        position: 'margin',
        side: 'left',
      },
      {
        id: 'about-2',
        text: 'Dharamshala taught me to observe. Engineering gave me tools to act on what I see.',
        position: 'inline',
      },
      {
        id: 'about-3',
        text: 'Current research: attention mechanisms in vision transformers. Trying to understand what makes them see.',
        position: 'margin',
        side: 'right',
      },
      {
        id: 'about-4',
        text: 'Current reading: The Missing Readme — Recurse Center. Slow progress.',
        position: 'margin',
        side: 'left',
      },
    ],
    skills: [
      {
        id: 'skills-1',
        text: 'These are tools I have used, not tools I have mastered. There is a difference.',
        position: 'margin',
        side: 'right',
      },
      {
        id: 'skills-2',
        text: 'Proficiency percentages are rough estimates. They change depending on what I have been working on recently.',
        position: 'margin',
        side: 'left',
      },
    ],
    projects: [
      {
        id: 'projects-1',
        text: 'Every project starts with a question. Not a plan.',
        position: 'margin',
        side: 'left',
      },
      {
        id: 'projects-2',
        text: 'First attempt failed. Second attempt taught me something. Third attempt worked.',
        position: 'margin',
        side: 'right',
      },
      {
        id: 'projects-3',
        text: 'Current experiment: using LoRA adapters for on-device model fine-tuning. Trying to make it work without a GPU cluster.',
        position: 'margin',
        side: 'left',
      },
    ],
    photography: [
      {
        id: 'photo-1',
        text: 'Photography taught me observation. Observation influences engineering. Engineering builds systems.',
        position: 'margin',
        side: 'left',
      },
      {
        id: 'photo-2',
        text: 'Current camera: Nikon Z50 with a 35mm prime. Learning to see before I shoot.',
        position: 'margin',
        side: 'right',
      },
    ],
    contact: [
      {
        id: 'contact-1',
        text: 'The irony of a contact form on a personal archive: you are asking the archive to remember you.',
        position: 'margin',
        side: 'right',
      },
    ],
    blog: [
      {
        id: 'blog-1',
        text: 'I write to understand. Not to teach.',
        position: 'margin',
        side: 'left',
      },
      {
        id: 'blog-2',
        text: 'Several half-written drafts in the queue. Publishing is slower than writing.',
        position: 'margin',
        side: 'right',
      },
    ],
    stats: [
      {
        id: 'stats-1',
        text: 'Numbers are easy to collect. Meaning is harder to extract.',
        position: 'margin',
        side: 'right',
      },
    ],
    quote: [
      {
        id: 'quote-1',
        text: 'Wrote this at 3 AM. Still means it.',
        position: 'margin',
        side: 'left',
      },
    ],
  },

  pageTransitions: {
    home: 'Opening archive...',
    projects: 'Opening case files...',
    blog: 'Opening field notes...',
    gallery: 'Opening observation log...',
    resume: 'Opening growth record...',
    notFound: 'Document not found in archive.',
  },

  statusLabels: {
    active: 'ACTIVE',
    ongoing: 'ONGOING',
    completed: 'COMPLETED',
    archived: 'ARCHIVED',
    draft: 'DRAFT',
  },

  documentTypes: {
    caseFile: 'CASE FILE',
    fieldNote: 'FIELD NOTE',
    observation: 'OBSERVATION',
    growthRecord: 'GROWTH RECORD',
  },

  revisionNotes: [
    'Revised after realizing the first version was too polished to be honest.',
    'Updated: added the failure I originally left out.',
    'Rewritten. The first draft sounded like a resume.',
    'Added context I originally thought was obvious.',
    'Removed marketing language. Added what actually happened.',
  ],
};

export const getAnnotation = (sectionId, index = 0) => {
  const sectionAnnotations = annotations.sections[sectionId];
  if (!sectionAnnotations || !sectionAnnotations[index]) return null;
  return sectionAnnotations[index];
};

export const getAllAnnotations = (sectionId) => {
  return annotations.sections[sectionId] || [];
};

export const getTransitionText = (page) => {
  return annotations.pageTransitions[page] || 'Opening archive...';
};

export const getRandomRevisionNote = () => {
  const idx = Math.floor(Math.random() * annotations.revisionNotes.length);
  return annotations.revisionNotes[idx];
};
