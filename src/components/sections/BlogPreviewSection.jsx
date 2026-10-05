import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data';
import EditorialHeading from '../common/EditorialHeading';
import SectionHeading from '../common/SectionHeading';

const latest = blogPosts.slice(0, 3);

// Static cards (a repeated pattern). Hover and keyboard focus share one state: the border and title warm; the
// cover stays as it is (no zoom, no grey-out).
const NoteCard = ({ post }) => (
  <li>
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col border border-notebook-border bg-notebook-surface transition-colors duration-200 hover:border-notebook-border-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:flex-row"
    >
      {post.coverImage && (
        <div className="relative h-36 shrink-0 overflow-hidden border-b border-notebook-border bg-notebook-bg sm:h-auto sm:w-44 sm:border-b-0 sm:border-r lg:w-52">
          <img
            src={post.coverImage}
            width={640}
            height={400}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 p-5 sm:p-6 lg:p-7">
        <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
          <span className="uppercase text-accent">{post.category}</span>
          <span className="text-ink-faint">{post.date}</span>
          <span className="text-ink-faint">{post.readTime}</span>
        </p>

        <EditorialHeading
          as="h3"
          variant="subsection"
          delay={100}
          className="mb-2 !text-body sm:!text-title !leading-[1.2] transition-colors duration-200 group-hover:!text-accent-strong group-focus-visible:!text-accent-strong"
        >
          {post.title}
        </EditorialHeading>

        <p className="mb-4 line-clamp-2 text-small text-ink-secondary">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {post.tags.slice(0, 2).map((tag) => (
              <li key={tag} className="border border-notebook-border px-1.5 py-0.5 font-mono text-meta text-ink-muted">{tag}</li>
            ))}
          </ul>
          <span aria-hidden="true" className="text-small text-ink-muted transition-colors duration-200 group-hover:text-ink-primary">
            Read →
          </span>
        </div>
      </div>
    </Link>
  </li>
);

const BlogPreviewSection = () => (
  <section
    id="blog"
    aria-labelledby="blog-title"
    className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
  >
    <div className="archive-container relative z-10">
      <SectionHeading number="04" id="blog-title" className="mb-8" reveal="lines">Field Notes</SectionHeading>

      <ul className="space-y-5">
        {latest.map((post) => (
          <NoteCard key={post.id} post={post} />
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-notebook-border pt-6">
        <span className="font-mono text-meta text-ink-faint">
          {blogPosts.length - latest.length} more archived
        </span>
        <Link
          to="/blog"
          className="arrow-link inline-flex min-h-11 items-center gap-2 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Browse archive <span aria-hidden="true" className="arrow">→</span>
        </Link>
      </div>
    </div>

    <div aria-hidden="true" className="py-5 sm:py-6" />
  </section>
);

export default BlogPreviewSection;
