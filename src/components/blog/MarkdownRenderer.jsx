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

const CodeBlock = ({ children, className, ...props }) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!className && !codeString.includes('\n')) {
    return (
      <code
        className="bg-notebook-surface px-1.5 py-0.5 font-mono text-[0.9em] text-accent-strong"
        {...props}
      >
        {children}
      </code>
    );
  }

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
    
    const sizeClasses = {
      1: 'text-title sm:text-headline mt-14 mb-6 font-editorial',
      2: 'text-title mt-12 mb-4 font-editorial',
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

const MarkdownRenderer = ({ content }) => {
  const components = useMemo(() => ({
    h1: createHeadingComponent(1, 2),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),

    p: ({ children }) => (
      <p className="mb-6 text-small sm:text-body-sm text-ink-secondary">
        {children}
      </p>
    ),

    strong: ({ children }) => (
      <strong className="text-ink-primary font-semibold">{children}</strong>
    ),

    em: ({ children }) => (
      <em className="text-ink-secondary italic">{children}</em>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-strong underline decoration-accent/50 underline-offset-4 transition-colors duration-200 hover:decoration-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {children}
      </a>
    ),

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

    code: ({ inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code className="bg-notebook-surface px-1.5 py-0.5 font-mono text-[0.9em] text-accent-strong">
            {children}
          </code>
        );
      }
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
    },

    pre: ({ children }) => <>{children}</>,

    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-6">
        <div className="font-editorial text-body italic text-ink-secondary [&_p]:mb-0 [&_p]:font-editorial [&_p]:text-body">{children}</div>
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
