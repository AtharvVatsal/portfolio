# Atharv Vatsal Portfolio

A modern, feature-rich portfolio website showcasing work as an AI/ML Engineer, Photographer, and Video Editor. Built with React, Tailwind CSS, and several modern web technologies.

## Tech Stack

- **Framework**: React 18.3.1 with React Router 6
- **Styling**: Tailwind CSS 3.4.15 + PostCSS
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Icons**: Lucide React
- **Animations**: Custom CSS animations + Framer Motion patterns
- **Email**: EmailJS for contact form
- **AI**: Google Gemini API for AI chatbot
- **Images**: Cloudinary CDN
- **SEO**: React Helmet Async

## Project Structure

```
src/
├── App.jsx                 # Main app with routing and PortfolioHome
├── index.js                # Entry point
├── index.css               # Tailwind imports + base styles
│
├── context/
│   └── ThemeContext.jsx    # Theme state (purple/cyan/green)
│
├── hooks/                  # Custom React hooks
│   ├── index.js
│   ├── useAnalytics.js     # GA4 tracking
│   ├── useGreeting.js       # Time-based greeting
│   ├── useMousePosition.js  # Cursor tracking
│   ├── useScrollProgress.js # Scroll position tracking
│   ├── useTypingEffect.js   # Typing animation
│   └── useVisibleSections.js # Intersection observer for nav
│
├── data/                   # Static data files
│   ├── index.js            # Barrel exports
│   ├── blog.js             # Blog posts metadata
│   ├── gallery.js          # Photography gallery data
│   ├── photoCategories.js  # Photo categories
│   ├── projects.js         # Project showcase data
│   ├── roles.js            # Typing animation roles
│   ├── skills.js           # Skills by category
│   ├── stats.js            # Statistics data
│   └── testimonials.js     # Testimonials
│
├── config/                 # Configuration files
│   ├── cloudinary.js       # Cloudinary cloud name + presets
│   ├── gemini.js           # Gemini API context + config
│   ├── links.js            # Social links + project links
│   └── seo.js              # SEO defaults + keywords
│
├── components/
│   ├── index.js            # Barrel exports
│   │
│   ├── common/             # Reusable UI components
│   │   ├── AIChatbot.jsx        # Gemini-powered chatbot
│   │   ├── CustomCursor.jsx     # Canvas cursor with glow
│   │   ├── EasterEgg.jsx         # Konami code + Matrix rain
│   │   ├── FloatingActionButtons.jsx # Scroll top + AI toggle
│   │   ├── MouseGlow.jsx        # Mouse-following gradient
│   │   ├── PageLoader.jsx       # Route loading spinner
│   │   ├── PageTransition.jsx   # Route fade transitions
│   │   ├── ScrollReveal.jsx      # Scroll-triggered animations
│   │   ├── SectionDivider.jsx    # Section separators
│   │   ├── SEO.jsx               # Helmet wrapper
│   │   ├── Skeleton.jsx          # Loading placeholders
│   │   └── index.js
│   │
│   ├── layout/             # Page structure
│   │   ├── Navbar.jsx           # Fixed navigation
│   │   ├── Footer.jsx           # Footer with links
│   │   └── index.js
│   │
│   ├── preloader/          # Initial loading screen
│   │   ├── Preloader.jsx
│   │   └── index.js
│   │
│   ├── sections/           # Home page sections
│   │   ├── HeroSection.jsx          # Landing hero
│   │   ├── AboutSection.jsx         # Identity cards
│   │   ├── StatsSection.jsx          # 3D tilt stats
│   │   ├── SkillsSection.jsx        # Skill categories
│   │   ├── QuoteSection.jsx          # Inspirational quote
│   │   ├── TechProjectsSection.jsx   # Projects showcase
│   │   ├── PhotographySection.jsx    # Photo marquee
│   │   ├── TestimonialsSection.jsx  # Client testimonials
│   │   ├── BlogPreviewSection.jsx    # Recent blog posts
│   │   ├── ContactSection.jsx        # Contact form
│   │   └── index.js
│   │
│   └── blog/               # Blog-specific components
│       ├── MarkdownRenderer.jsx
│       ├── TableOfContents.jsx
│       ├── ReadingProgress.jsx
│       └── index.js
│
├── pages/                  # Route pages
│   ├── BlogPage.jsx             # Blog listing
│   ├── BlogPostPage.jsx         # Individual post
│   ├── GalleryPage.jsx          # Photo gallery
│   ├── ProjectsPage.jsx         # Full projects list
│   ├── ResumePage.jsx           # Interactive resume
│   ├── NotFoundPage.jsx         # 404 page
│   └── index.js
│
└── styles/
    └── animations.css        # Custom keyframe animations
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required for AI Chatbot
REACT_APP_GEMINI_API_KEY=your_gemini_api_key

# Optional - Google Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note**: Without `REACT_APP_GEMINI_API_KEY`, the AI chatbot will show a warning but the rest of the site works fine.

### Development

```bash
# Start development server
npm start
# Opens at http://localhost:3000

# Build for production
npm run build

# Build for GitHub Pages (if hosted there)
npm run deploy
```

## Features

### Themes
Three color themes available:
- **Purple** (default) - Deep purple gradients
- **Cyan** - Cyan/teal accents
- **Green** - Green/emerald accents

Toggle via Navbar button.

### Animations

**Desktop:**
- Scroll-triggered fade-up/scale animations
- 3D tilt effects on cards
- Mouse-following glow effects
- Custom canvas cursor with trail

**Mobile:**
- Simple fade in/out on scroll
- No heavy animations for performance

### Special Features
- **Easter Egg**: Press `↑↑↓↓←→←→BA` (Konami code) for Matrix rain effect
- **AI Chatbot**: Gemini-powered assistant with portfolio context
- **Photography Gallery**: Lightbox with Cloudinary images
- **Blog**: Markdown rendering with syntax highlighting
- **Reading Progress**: Progress bar on blog posts

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Single-page portfolio with all sections |
| `/blog` | Blog | Blog listing with search/filter |
| `/blog/:slug` | Post | Individual blog post |
| `/gallery` | Gallery | Photography with lightbox |
| `/projects` | Projects | Full projects listing |
| `/resume` | Resume | Interactive resume |
| `*` | 404 | Not found page |

## Data Files

### Adding a Project

Edit `src/data/projects.js`:

```javascript
export const projects = [
  {
    id: 'project-id',
    title: 'Project Title',
    description: 'Short description',
    tech: ['React', 'Node.js'],
    color: 'from-cyan-500 to-blue-500',
    featured: true,
  },
  // ...
];
```

Then add links in `src/config/links.js`:
```javascript
export const PROJECT_LINKS = {
  'project-id': {
    demo: 'https://demo.com',
    github: 'https://github.com/username/repo',
  },
};
```

### Adding a Blog Post

1. Create markdown file in `public/blog/` folder
2. Add metadata in `src/data/blog.js`:
```javascript
export const blogPosts = [
  {
    slug: 'post-slug',
    title: 'Post Title',
    excerpt: 'Short excerpt',
    date: '2024-01-15',
    readTime: '5 min',
    tags: ['Tech', 'AI'],
    coverImage: '/images/cover.jpg',
  },
];
```

### Adding Gallery Photos

Edit `src/data/gallery.js`:
```javascript
export const galleryPhotos = [
  {
    id: 'photo-1',
    title: 'Photo Title',
    location: 'Location',
    camera: 'Sony A7III',
    thumbnail: 'cloudinary-url-thumb',
    src: 'cloudinary-url-full',
    category: 'Landscape',
    featured: true,
    exif: {
      aperture: 'f/2.8',
      shutter: '1/250s',
      iso: 400,
      focalLength: '50mm',
    },
  },
];
```

### Adding Skills

Edit `src/data/skills.js` and `src/data/roles.js`.

## Components

### ScrollReveal

Wrapper component for scroll animations:

```jsx
<ScrollReveal variant="fade-up" duration={1000} delay={200}>
  <YourComponent />
</ScrollReveal>
```

**Variants**: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale`, `fade-scale`, `fade-blur`

### MouseGlow

Gradient that follows cursor:

```jsx
<MouseGlow
  mousePosition={mousePosition}
  size={600}
  blur={80}
  gradient="radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)"
/>
```

### SectionDivider

Visual section separators:

```jsx
<SectionDivider color="cyan" animated />
```

**Colors**: `cyan`, `purple`, `blue`, `pink`

## Deployment

### GitHub Pages

```bash
npm run deploy
```

Requires `homepage` field in `package.json`:
```json
{
  "homepage": "https://username.github.io/repository"
}
```

### Vercel / Netlify

1. Push to GitHub
2. Connect repository in Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `build`

### Static Hosting

```bash
npm run build
# Upload 'build' folder to any static host
```

## Performance Notes

- Code splitting via React.lazy for page routes
- Image lazy loading
- Cloudinary responsive images
- Mobile-specific animation optimizations
- Passive scroll listeners

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Not optimized for IE11.

## License

MIT License - feel free to use and modify.

## Author

**Atharv Vatsal**
- Website: [atharvvatsal.com](https://atharvvatsal.com)
- GitHub: [@atharvvatsal](https://github.com/atharvvatsal)
- LinkedIn: [Atharv Vatsal](https://linkedin.com/in/atharvvatsal)
