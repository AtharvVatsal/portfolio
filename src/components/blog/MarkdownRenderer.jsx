import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

// Code block with copy button
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
    // Inline code
    return (
      <code
        className="text-amber-400 bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-white/10">
      {/* Language label + copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-mono text-gray-500 uppercase">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors duration-300"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
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
          background: 'rgba(0, 0, 0, 0.4)',
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

// Extract headings from markdown for table of contents
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

// Custom heading component that adds IDs for anchor links
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
      1: 'text-3xl sm:text-4xl mt-12 mb-6',
      2: 'text-2xl sm:text-3xl mt-10 mb-4',
      3: 'text-xl sm:text-2xl mt-8 mb-3',
    };

    return (
      <Tag
        id={id}
        className={`font-bold text-white ${sizeClasses[level]} group scroll-mt-24`}
        {...props}
      >
        <a
          href={`#${id}`}
          className="no-underline hover:no-underline flex items-center gap-2"
        >
          {children}
          <span className="opacity-0 group-hover:opacity-50 transition-opacity duration-300 text-cyan-400 text-lg">
            #
          </span>
        </a>
      </Tag>
    );
  };
  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
};

// Markdown renderer component
const MarkdownRenderer = ({ content }) => {
  const components = useMemo(() => ({
    // Headings with IDs
    h1: createHeadingComponent(1),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-gray-300 leading-relaxed mb-6 text-base sm:text-lg">
        {children}
      </p>
    ),

    // Strong / Bold
    strong: ({ children }) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),

    // Emphasis / Italic
    em: ({ children }) => (
      <em className="text-gray-200 italic">{children}</em>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors duration-300"
      >
        {children}
      </a>
    ),

    // Unordered Lists
    ul: ({ children }) => (
      <ul className="space-y-2 mb-6 ml-4">
        {children}
      </ul>
    ),

    // Ordered Lists
    ol: ({ children }) => (
      <ol className="space-y-2 mb-6 ml-4 list-decimal list-inside">
        {children}
      </ol>
    ),

    // List Items
    li: ({ children }) => (
      <li className="text-gray-300 text-base sm:text-lg leading-relaxed flex items-start gap-2">
        <span className="text-cyan-400 mt-2 flex-shrink-0">•</span>
        <span>{children}</span>
      </li>
    ),

    // Code blocks and inline code
    code: ({ inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code className="text-amber-400 bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
    },

    // Pre tags (wrapper for code blocks)
    pre: ({ children }) => <>{children}</>,

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-400/50 pl-6 my-6 bg-white/5 rounded-r-xl py-4 pr-4">
        <div className="text-gray-300 italic">{children}</div>
      </blockquote>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="bg-white/10 text-white">{children}</thead>
    ),

    tbody: ({ children }) => (
      <tbody className="divide-y divide-white/5">{children}</tbody>
    ),

    tr: ({ children }) => (
      <tr className="hover:bg-white/5 transition-colors">{children}</tr>
    ),

    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-semibold text-white border-b border-white/10">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="px-4 py-3 text-gray-300">{children}</td>
    ),

    // Horizontal Rule
    hr: () => (
      <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    ),

    // Images
    img: ({ src, alt }) => (
      <div className="my-8">
        <img
          src={src}
          alt={alt || ''}
          className="rounded-xl border border-white/10 shadow-xl w-full"
          loading="lazy"
        />
        {alt && (
          <p className="text-center text-sm text-gray-500 mt-3 italic">
            {alt}
          </p>
        )}
      </div>
    ),
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