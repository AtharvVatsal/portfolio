import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// The light Prism build: only the grammars registered here are bundled (the full
// build added ~1 MB to every post, and no post's code fence names a language).
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Maximize2, Minimize2 } from 'lucide-react';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

// A wide table scrolls sideways on phones: the scroller is a focusable region,
// named after its column headings so several tables on a page stay distinct.
const TableRegion = ({ children }) => {
  const ref = useRef(null);
  const [label, setLabel] = useState('Table');
  useEffect(() => {
    const heads = [...(ref.current?.querySelectorAll('thead th') || [])].map((t) => t.textContent.trim()).filter(Boolean).slice(0, 4);
    if (heads.length) setLabel(`Table: ${heads.join(', ')}`);
  }, [children]);
  return (
    <div ref={ref} tabIndex={0} role="region" aria-label={label} className="overflow-x-auto my-6 border border-notebook-border focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus">
      <table className="w-full text-small">
        {children}
      </table>
    </div>
  );
};

// A fenced code block, always set as a block (a one-line fence too), so every
// note shows code the same way. Inline `code` is the `code` component below.
const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 border border-notebook-border overflow-hidden">
      {/* Language label + copy button */}
      <div className="flex items-center justify-between border-b border-notebook-border bg-notebook-surface-alt pl-4 pr-1">
        <span className="font-mono text-meta uppercase text-ink-faint">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : `Copy ${language || 'code'} to clipboard`}
          className="flex min-h-11 items-center gap-1.5 px-3 text-small text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
        >
          {copied ? (
            <>
              <Check size={14} aria-hidden="true" className="text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        tabIndex={0}
        role="region"
        aria-label={`${language ? `${language} code` : 'Code'}: ${(codeString.split('\n').find((l) => l.trim()) || '').trim().slice(0, 48)}`}
        className="focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'rgb(var(--archive-ground-sunken))',
          fontSize: '0.875rem',
          lineHeight: '1.7',
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

// Every note is set the same way, whatever conventions it was written with.
// The Markdown files are left as written; this reads their opening and their
// rules, and returns what the page renders:
//   - a leading "# Title" is dropped: the page's own <h1> is the title, so it
//     is never set twice or listed in the contents;
//   - a leading italic-only line becomes the note's dek (its subtitle), set in
//     one style above the contents - unless it only repeats the header's
//     metadata ("12 min read · …"), which is dropped;
//   - the rule that opens the article, and any rule written just before a
//     heading, are dropped: every "##" section opens with the same hairline.
// Rules elsewhere (e.g. before a closing note) stay as written.
const RULE = /^ {0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/;
const HEADING = /^ {0,3}#{1,6}\s/;
const FENCE = /^ {0,3}(```|~~~)/;
// `*text*` or `_text_` alone on a line (not **bold**). No lookbehind: older
// Safari cannot parse one, and that would break the whole module.
const ITALIC_LINE = /^\s*([*_])(?!\1)(.*[^*_\s])\1\s*$/;

export const prepareNote = (markdown = '') => {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  let i = 0;
  const skipBlank = () => { while (i < lines.length && !lines[i].trim()) i += 1; };

  skipBlank();
  if (/^ {0,3}#\s/.test(lines[i] || '')) { i += 1; skipBlank(); }

  let dek = null;
  const italic = ITALIC_LINE.exec(lines[i] || '');
  if (italic && !(lines[i + 1] || '').trim()) {
    const text = italic[2].trim();
    if (!/\bmin read\b/i.test(text)) dek = text;
    i += 1;
    skipBlank();
  }
  if (RULE.test(lines[i] || '')) { i += 1; }

  const rest = lines.slice(i);
  const nextContent = (from) => {
    for (let k = from; k < rest.length; k += 1) if (rest[k].trim()) return rest[k];
    return '';
  };
  const body = [];
  let inCode = false;
  rest.forEach((line, k) => {
    if (FENCE.test(line)) inCode = !inCode;
    else if (!inCode && RULE.test(line) && HEADING.test(nextContent(k + 1))) return;
    body.push(line);
  });
  return { dek, body: body.join('\n').trim() };
};

export const extractHeadings = (markdown) => {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    headings.push({ level, text, id });
  }

  return headings;
};

// Markdown wraps images in <p>, so everything rendered in place is phrasing
// content (a button and spans). The enlarged view is a modal dialog rendered
// in a portal: focus moves to its close button, stays inside, Esc closes it,
// and focus returns to the image that opened it.
const ZoomableBlogImage = ({ src, alt }) => {
  const [zoomed, setZoomed] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!zoomed) return undefined;
    document.body.style.overflow = 'hidden';
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setZoomed(false); }
      else if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey, true);
      trigger?.focus();
    };
  }, [zoomed]);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setZoomed(true)}
        aria-label={alt ? `Enlarge image: ${alt}` : 'Enlarge image'}
        className="group relative my-8 block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        <img
          src={src}
          alt={alt || ''}
          className="w-full border border-notebook-border"
          loading="lazy"
        />
        <span aria-hidden="true" className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center border border-notebook-border-light bg-notebook-bg/90 text-ink-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 size={13} />
        </span>
      </button>
      {alt && <span className="-mt-6 mb-8 block text-small text-ink-muted">{alt}</span>}

      {zoomed && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Enlarged image'}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-notebook-bg/95"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            ref={closeRef}
            onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
            aria-label="Close enlarged image"
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center border border-notebook-border-light bg-notebook-bg text-ink-secondary transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Minimize2 size={15} aria-hidden="true" />
          </button>
          <img src={src} alt={alt || ''} className="max-w-[90vw] max-h-[90vh] object-contain select-none" draggable={false} />
        </div>,
        document.body
      )}
    </>
  );
};

// level sets the look; tag sets the element. A Markdown "#" renders as <h2>
// (styled as level 1) because the post title above is the page's only <h1>.
const createHeadingComponent = (level, tag = level) => {
  const HeadingComponent = ({ children, ...props }) => {
    const text = typeof children === 'string'
      ? children
      : React.Children.toArray(children)
          .map(child => (typeof child === 'string' ? child : child?.props?.children || ''))
          .join('');
    
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const Tag = `h${tag}`;
    
    // A section ("#" or "##") opens with a hairline, as case-file sections
    // do; the article's first block needs none.
    const section = 'mt-14 border-t border-notebook-border pt-8 first:mt-0 first:border-t-0 first:pt-0';
    const sizeClasses = {
      1: `text-title sm:text-headline mb-6 font-editorial ${section}`,
      2: `text-title mb-4 font-editorial ${section}`,
      3: 'text-lead mt-10 mb-3 font-editorial',
    };

    return (
      <Tag
        id={id}
        className={`text-ink-primary ${sizeClasses[level]} group scroll-mt-24`}
        {...props}
      >
        <a
          href={`#${id}`}
          className="flex items-center gap-2 no-underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          {children}
          <span aria-hidden="true" className="font-mono text-meta text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-70">
            #
          </span>
        </a>
      </Tag>
    );
  };
  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
};

const Strong = ({ children }) => (
  <strong className="text-ink-primary font-semibold">{children}</strong>
);

const Emphasis = ({ children }) => (
  <em className="text-ink-secondary italic">{children}</em>
);

const Anchor = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent-strong underline decoration-accent/50 underline-offset-4 transition-colors duration-200 hover:decoration-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
  >
    {children}
  </a>
);

// True when a paragraph's only content is one <em> (whitespace aside).
const isAside = (node) => {
  const kids = (node?.children || []).filter((c) => !(c.type === 'text' && !c.value.trim()));
  return kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'em';
};

// A short run of Markdown set inline (the note's dek): links, bold and
// italics keep the article's treatment; no paragraph of its own.
const INLINE_COMPONENTS = {
  p: ({ children }) => <>{children}</>,
  strong: Strong,
  em: ({ children }) => <em>{children}</em>,
  a: Anchor,
};
export const InlineMarkdown = ({ content }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={INLINE_COMPONENTS}>{content}</ReactMarkdown>
);

const MarkdownRenderer = ({ content }) => {
  const components = useMemo(() => ({
    h1: createHeadingComponent(1, 2),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),

    // A paragraph that is only italic text is an aside (a closing note, a
    // gloss under a formula): one quieter style in every note.
    p: ({ node, children }) => (
      <p className={isAside(node)
        ? 'mb-6 text-small text-ink-muted [&_em]:text-ink-muted'
        : 'mb-6 text-small sm:text-body-sm text-ink-secondary'}
      >
        {children}
      </p>
    ),

    strong: Strong,
    em: Emphasis,
    a: Anchor,

    ul: ({ children }) => (
      <ul className="md-list space-y-2 mb-6 ml-4">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="md-list md-ol space-y-2 mb-6 ml-4">
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li className="flex items-start gap-3 text-small sm:text-body-sm text-ink-secondary">
        <span aria-hidden="true" className="md-bullet mt-[0.85em] h-px w-3 shrink-0 bg-accent" />
        <span>{children}</span>
      </li>
    ),

    // Inline `code`. A fenced block arrives as <pre><code>, so `pre` sets it
    // as a block (react-markdown 10 no longer marks code as inline).
    code: ({ children }) => (
      <code className="bg-notebook-surface px-1.5 py-0.5 font-mono text-[0.9em] text-accent-strong">
        {children}
      </code>
    ),

    pre: ({ children }) => {
      const code = React.Children.toArray(children)[0];
      return <CodeBlock className={code?.props?.className}>{code?.props?.children}</CodeBlock>;
    },

    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-6">
        {/* A quote keeps the quote style even when its text is all italic. */}
        <div className="font-editorial text-body italic text-ink-secondary [&_p]:mb-0 [&_p]:font-editorial [&_p]:text-body [&_p]:text-ink-secondary [&_em]:text-ink-secondary">{children}</div>
      </blockquote>
    ),

    // A wide table scrolls sideways on phones; the scroller is a focusable, named region.
    table: ({ children }) => (
      <TableRegion>{children}</TableRegion>
    ),

    thead: ({ children }) => (
      <thead className="bg-notebook-surface text-ink-primary">{children}</thead>
    ),

    tbody: ({ children }) => (
      <tbody className="divide-y divide-notebook-border">{children}</tbody>
    ),

    tr: ({ children }) => (
      <tr>{children}</tr>
    ),

    th: ({ children }) => (React.Children.toArray(children).some((c) => (typeof c === 'string' ? c.trim() : true)) ? (
      <th className="px-4 py-3 text-left font-semibold text-ink-primary border-b border-notebook-border font-mono text-meta uppercase">
        {children}
      </th>
    ) : (
      <td className="px-4 py-3 border-b border-notebook-border" />
    )),

    td: ({ children }) => (
      <td className="px-4 py-3 text-ink-secondary">{children}</td>
    ),

    hr: () => (
      <hr className="my-8 border-none h-px bg-notebook-border" />
    ),

    img: ({ src, alt }) => <ZoomableBlogImage src={src} alt={alt} />,
  }), []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
