# Atharv Vatsal — Personal Archive

The personal site of Atharv Vatsal, a CS student at VIT specialising in AI/ML, and a photographer: project case files, field notes and photographs.

Live at **[atharvvatsal.com](https://atharvvatsal.com)**.

The site is built as an archive. Projects are **case files** (problem → approach → first attempt and revision → evidence → result → lessons → technical record). Writing is **field notes**, and photographs are **observations**.

## What's on the site

| Route | Page |
|---|---|
| `/` | Home: hero, Curiosity (about), Toolbox (skills), Case Files (four most recent), Field Notes (latest three), Observations (a desk of prints), Contact |
| `/projects` | The case-file register: all eight projects |
| `/projects/:slug` | One case file, with its evidence and technical record |
| `/blog` | Field notes, searchable and filterable by category |
| `/blog/:slug` | One field note (Markdown, with maths and code) |
| `/gallery` | Observations: the full photographic archive and a photo viewer |
| `/resume` | The résumé, with a downloadable PDF |
| `*` | Not-found page |

There is also an AI assistant (Google Gemini) on the home page. It answers from the site's own data.

## Tech stack

| Area | Tools |
|---|---|
| App | React 18, React Router 6, Create React App (`react-scripts` 5) |
| Styling | Tailwind CSS 3, PostCSS |
| Motion | `motion` (the gallery wall), GSAP ScrollTrigger (one reading reveal); restrained, and off under `prefers-reduced-motion` |
| Content | `react-markdown` + `remark-gfm`, `remark-math`/`rehype-katex`, `react-syntax-highlighter` (Prism light build) |
| Services | Cloudinary (photographs), EmailJS (contact form), Google Gemini (assistant), optional Google Analytics |
| SEO | `react-helmet-async` (titles, Open Graph/Twitter cards, JSON-LD) |
| Icons | `lucide-react` |

## Getting started

**Prerequisites:** Node.js 18 or later (developed on Node 24) and npm.

```bash
git clone https://github.com/AtharvVatsal/portfolio.git
cd portfolio
npm install
npm start          # http://localhost:3000
```

### Environment variables

Create a `.env` file in the project root. Every variable is optional: the site works without them, and only the feature that needs one is affected.

```env
# AI assistant (Google Gemini)
REACT_APP_GEMINI_API_KEY=

# Contact form (EmailJS)
REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=
REACT_APP_EMAILJS_PUBLIC_KEY=

# Analytics (Google Analytics 4)
REACT_APP_GA_MEASUREMENT_ID=
```

Create React App bakes these in at **build time**, so set them on your host before building.

### Scripts

| Command | What it does |
|---|---|
| `npm start` | Development server |
| `npm run build` | Production build in `build/` |
| `CI=true npm run build` | Production build that fails on any warning (as CI hosts run it) |
| `npx eslint --ext .js,.jsx src` | Lint (`--ext` is needed so `.jsx` files are checked) |

## Project structure

```
public/
  blog/posts/*.md        field-note text (Markdown)
  blog/                  field-note images
  Case Files/<project>/  case-file evidence (originals in original/, WebP display copies beside them)
  AtharvVatsalResume.pdf the downloadable résumé
src/
  App.jsx                routes and the home page
  index.css              design tokens, base styles, font fallbacks
  config/                links.js (contact + links), seo.js, gemini.js (assistant), cloudinary.js, env.js
  data/                  the site's content (see below)
  components/
    sections/            home-page sections
    casefile/            case-file figures, evidence and measures
    observations/        gallery wall and photo viewer
    blog/                Markdown renderer, table of contents
    common/              shared UI (headings, reveals, SEO, assistant, …)
    layout/              navigation bar, page header, footer
    motion/, reactbits/  the few text-motion pieces
  pages/                 one file per route
```

## Content: where each fact lives

Every fact has one home, and the pages, the résumé page and the AI assistant all read from it. Change a fact there, not in a component.

| Fact | File |
|---|---|
| Projects: names, problems, approaches, results, metrics, periods, stacks | `src/data/projects.js` |
| Contact details, social profiles, project links | `src/config/links.js` |
| Case-file evidence, open evidence requests, measured changes, notes on unresolved figures, private projects | `src/data/caseFiles.js` |
| Skills (the Toolbox) | `src/data/toolbox.js` |
| Field notes: metadata, excerpts, cover origins | `src/data/blog.js` (text in `public/blog/posts/`) |
| Photographs: titles, captions, places, dates, camera, lens, settings | `src/data/gallery.js` |
| Site title, page headers, footer notes | `src/data/archiveMeta.js` |

### Adding or editing

- **A project.** Add a record to `src/data/projects.js`. Its `projectKey` is its URL slug. Add its repository and demo links to `PROJECT_LINKS` in `src/config/links.js`.
- **Case-file evidence.** File real artifacts only:
  1. Put the original, unedited, in `public/Case Files/<project>/original/`.
  2. Add resized WebP copies beside it.
  3. Register it in `VISUAL_EVIDENCE` in `src/data/caseFiles.js`, with its `source`.
  4. Remove the matching entry from `EVIDENCE_REQUESTS`.

  A case's evidence status (complete, partial, awaiting evidence, private) is derived automatically.
- **A field note.** Add the Markdown file to `public/blog/posts/` and an entry to `src/data/blog.js`. The list is newest first, so add new entries at the top. Label AI-generated images "(AI Generated)" in their alt text.
- **A photograph.** Upload it to Cloudinary and add an entry to `src/data/gallery.js` with its `publicId`. Record a lens or exposure setting only where the file's own EXIF records it; leave unknown values out rather than guessing.
- **Skills.** Edit `src/data/toolbox.js`.

The résumé PDF is a curated presentation of the same facts. Where it differs from the data files, the data files are authoritative for the site.

## Quality bar

At launch the site was checked on the production build, at 17 screen sizes from 320×568 to 2560×1440, on every route:
- no horizontal overflow, clipped text, or text under 12px
- no broken or distorted images
- touch targets of at least 24px
- 16px form inputs (no iOS zoom)
- keyboard access throughout, with a skip link, visible focus and dialogs that trap and return focus
- 0 axe violations (WCAG 2.2 AA plus best practice)
- no layout shift
- motion that respects reduced-motion preferences

## Deployment

```bash
npm run build      # upload build/ to any static host
```

- **SPA fallback.** This is a single-page app: configure your host to serve `index.html` for unknown paths, so that deep links such as `/projects/drivesense` load on refresh. Missing asset files should still return 404.
- **Headers.** `public/_headers` holds response headers for hosts that read that file.
- **Environment variables.** Set the variables above in your host's settings before building.

## Local-only documentation

The design and QA record is kept locally and is deliberately untracked (see `.gitignore`):
- `DESIGN-IMPLEMENTATION-CHECKPOINT.md`
- the phase reports in `docs/`
- the content validators in `scripts/`
- the audit and browser test suite in `design-audit/`

## License

MIT License — feel free to use and modify.

## Author

**Atharv Vatsal**
- Website: [atharvvatsal.com](https://atharvvatsal.com)
- GitHub: [@AtharvVatsal](https://github.com/AtharvVatsal)
- LinkedIn: [atharvvatsal](https://www.linkedin.com/in/atharvvatsal)
- Instagram (photography): [@privet.avos](https://instagram.com/privet.avos)
