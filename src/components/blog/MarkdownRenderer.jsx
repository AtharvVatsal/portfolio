import React, { useMemo, useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Maximize2, Minimize2 } from 'lucide-react';

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
        className="text-blueprint bg-blueprint/5 px-1.5 py-0.5 text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6 border border-notebook-border overflow-hidden">
      {/* Language label + copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-notebook-border">
        <span className="text-xs font-mono text-ink-faint uppercase">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-mono text-ink-faint hover:text-ink-primary transition-colors duration-300"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'rgba(0, 0, 0, 0.3)',
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

const ZoomableBlogImage = ({ src, alt }) => {
  const [zoomed, setZoomed] = useState(false);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    if (zoomed) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [zoomed]);

  return (
    <>
      <div className="my-8 group cursor-zoom-in relative overflow-hidden"
        onClick={() => { if (imgRef.current) setNatural({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight }); setZoomed(true); }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          className="w-full border border-notebook-border transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
            <Maximize2 size={13} className="text-white/70" />
          </div>
        </div>
      </div>
      {alt && <p className="text-center text-xs text-ink-faint/70 mt-1 mb-6 font-mono italic">{alt}</p>}

      {zoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setZoomed(false)}
          style={{ background: 'rgba(10,9,8,0.96)', animation: 'imgZoomOv 0.25s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          <style>{`@keyframes imgZoomOv { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <button onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
            className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
            style={{ background: 'rgba(40,37,31,0.3)', color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(40,37,31,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <Minimize2 size={15} />
          </button>
          <img src={src} alt={alt || ''} className="max-w-[90vw] max-h-[90vh] object-contain select-none" draggable={false}
            style={{ animation: 'imgZoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both' }} />
          <style>{`@keyframes imgZoomIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}
    </>
  );
};

const createHeadingComponent = (level) => {
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

    const Tag = `h${level}`;
    
    const sizeClasses = {
      1: 'text-3xl sm:text-4xl mt-12 mb-6 font-editorial',
      2: 'text-2xl sm:text-3xl mt-10 mb-4 font-editorial',
      3: 'text-xl sm:text-2xl mt-8 mb-3 font-editorial',
    };

    return (
      <Tag
        id={id}
        className={`text-ink-primary ${sizeClasses[level]} group scroll-mt-24`}
        {...props}
      >
        <a
          href={`#${id}`}
          className="no-underline hover:no-underline flex items-center gap-2"
        >
          {children}
          <span className="opacity-0 group-hover:opacity-40 transition-opacity duration-300 text-blueprint text-sm font-mono">
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
    h1: createHeadingComponent(1),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),

    p: ({ children }) => (
      <p className="text-ink-secondary leading-relaxed mb-6 text-base sm:text-lg">
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
        className="text-blueprint hover:text-blueprint/80 underline underline-offset-2 decoration-blueprint/30 hover:decoration-blueprint/60 transition-colors duration-300"
      >
        {children}
      </a>
    ),

    ul: ({ children }) => (
      <ul className="space-y-2 mb-6 ml-4">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="space-y-2 mb-6 ml-4 list-decimal list-inside">
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li className="text-ink-secondary text-base sm:text-lg leading-relaxed flex items-start gap-2">
        <span className="text-blueprint mt-2 flex-shrink-0 font-mono">â€º</span>
        <span>{children}</span>
      </li>
    ),

    code: ({ inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code className="text-blueprint bg-blueprint/5 px-1.5 py-0.5 text-sm font-mono">
            {children}
          </code>
        );
      }
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
    },

    pre: ({ children }) => <>{children}</>,

    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-blueprint/40 pl-6 my-6 bg-blueprint/5 py-4 pr-4">
        <div className="text-ink-secondary italic">{children}</div>
      </blockquote>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-6 border border-notebook-border">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="bg-surface text-ink-primary">{children}</thead>
    ),

    tbody: ({ children }) => (
      <tbody className="divide-y divide-notebook-border">{children}</tbody>
    ),

    tr: ({ children }) => (
      <tr className="hover:bg-surface transition-colors">{children}</tr>
    ),

    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-semibold text-ink-primary border-b border-notebook-border font-mono text-xs uppercase tracking-wider">
        {children}
      </th>
    ),

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
