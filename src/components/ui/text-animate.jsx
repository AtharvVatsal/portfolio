import React, { memo } from 'react';
import EditorialReveal from '../common/EditorialReveal';

// Magic UI TextAnimate (npx shadcn@latest add @magicui/text-animate), ported
// to JSX for this Create React App project: the same props and the same
// animation presets, played by the archive's own text engine (EditorialReveal)
// instead of motion/react.
//
// Why not motion: TextAnimate would bring the motion library (~48 kB) to every
// page that has a paragraph, phones included; EditorialReveal is already on
// every page. It also does what an archive of readable text needs: the text is
// real and visible until, just before first paint, it is armed (only if it can
// be shown again: IntersectionObserver, no reduced motion, not scrolled past);
// it reveals once in view, with a safety net; keyboard focus inside shows it
// at once; and afterwards the words are plain inline text again (selection
// and find-in-page work across them). The original's aria-label on the
// element and aria-hidden segments are not needed - the text itself is read -
// and an aria-label on a <p> is a prohibited attribute.
//
//   children   text (a string, or text with one level of styled phrases)
//   as         element: p (default), div, span, li, blockquote, h1-h6, ...
//   by         'text' (the element as one piece), 'word', 'line', or
//              'character' (played by word here: letters animating one by
//              one in body text is more motion than this archive wants)
//   animation  fadeIn | blurIn | blurInUp | blurInDown | slideUp | slideDown |
//              slideLeft | slideRight | scaleUp | scaleDown
//   delay      seconds before it starts, once in view
//   duration   seconds the whole sequence may stretch across (the stagger
//              tightens for long text; each segment's own move is the
//              archive's editorial timing)
//   once       true (default here): plays the first time it is seen.
//              false: plays again each time it comes back into view.
//   startOnView  false: plays on arrival (first paint) instead of on view -
//              the engine already does this for text in view at load.
//
// The presets are the original's, made quieter for body text (smaller
// distances, a lighter blur): see TEXT ANIMATE in index.css.

const MODE = { text: 'fade', word: 'words', character: 'words', line: 'lines' };

const TextAnimateBase = ({
  children,
  as = 'p',
  by = 'word',
  animation = 'fadeIn',
  delay = 0,
  duration,
  once = true,
  startOnView, // eslint-disable-line no-unused-vars -- see above
  className = '',
  style,
  ...rest
}) => (
  <EditorialReveal
    as={as}
    mode={MODE[by] || 'words'}
    replay={!once}
    delay={Math.round(delay * 1000)}
    className={className}
    style={duration ? { ...style, '--reveal-spread': `${Math.round(duration * 1000)}ms` } : style}
    data-anim={animation}
    {...rest}
  >
    {children}
  </EditorialReveal>
);

export const TextAnimate = memo(TextAnimateBase);
