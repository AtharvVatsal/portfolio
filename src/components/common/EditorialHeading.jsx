import React from 'react';
import EditorialReveal from './EditorialReveal';

// The archive's headings: one component, four sizes. A heading is static
// unless it is one of the few deliberate arrivals (`reveal`), so motion stays
// a hierarchy tool rather than the behaviour of every title (see the motion
// audit in DESIGN-IMPLEMENTATION-CHECKPOINT §30).
//
//   as       the real heading element: 'h1' | 'h2' | 'h3' (semantics stay intact)
//   variant  'page'       page titles                (h1)
//            'section'    section headings            (h2)
//            'editorial'  large authored statements   (hero, closing lines)
//            'subsection' smaller structural headings (h3)
//   reveal   opt in to an arrival, once, when it enters the viewport. true or
//            'heading': the whole heading rises 24px out of a slight blur (a
//            focus pull). Or any other EditorialReveal mode: 'mask' (words rise
//            out of their baseline), 'words' (word by word), 'lines' (line by
//            line), 'fade'. Reduced motion: simply visible.
//   replay   with reveal: re-arm when fully off screen and arrive again on
//            re-entry (off by default)
//   delay    ms after entering view, for rhythm with the metadata above it

const VARIANTS = {
  page: 'font-editorial text-headline sm:text-display text-ink-primary',
  section: 'font-editorial text-title sm:text-headline text-ink-primary',
  editorial: 'font-editorial text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.08] text-ink-primary',
  subsection: 'font-editorial text-title text-ink-primary',
};

const EditorialHeading = ({
  as: Tag = 'h2',
  variant = 'section',
  reveal = false,
  replay = false,
  delay = 0,
  className = '',
  children,
  ...rest
}) => {
  const cls = `${VARIANTS[variant] || VARIANTS.section} ${className}`;
  if (!reveal) return <Tag className={cls} {...rest}>{children}</Tag>;
  const mode = typeof reveal === 'string' ? reveal : 'heading';
  return (
    <EditorialReveal as={Tag} mode={mode} replay={replay} delay={delay} className={cls} {...rest}>
      {children}
    </EditorialReveal>
  );
};

export default EditorialHeading;
