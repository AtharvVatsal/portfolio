import React, { memo, useState, useCallback } from 'react';
import { galleryPhotos } from '../../data/gallery';
import { getGalleryImageUrl, getCloudinaryUrl } from '../../config/cloudinary';
import { archiveMeta } from '../../data/archiveMeta';
import EditorialHeading from '../common/EditorialHeading';
import DrawnText from '../motion/DrawnText';
import RolesWordmark from '../motion/RolesWordmark';

// Stable identity: name, one statement, one line of roles. Two moments, never
// competing: the name is registered once on arrival (drawn: StrokeText), and
// the roles line is the hero's one interaction - an outline wordmark lit by the
// pointer (Aceternity TextHoverEffect). The statement (the page's h1) simply
// stands, so the hero reads at once with or without motion. Nothing loops or
// retypes. The section fills the screen below the navigation bar.
const HeroSection = memo(() => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const photo = galleryPhotos.find(p => p.id === 1) || galleryPhotos[0];
  const url = photo ? getGalleryImageUrl(photo.publicId) : null;
  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <section id="home" className="relative w-full h-[calc(100dvh-3.5rem)] overflow-hidden bg-archive-night">
      {url && !error ? (
        <img
          src={url.full}
          srcSet={[960, 1280, 1920, 2560].map((w) => `${getCloudinaryUrl(photo.publicId, { width: w, quality: 'auto:best' })} ${w}w`).join(', ')}
          sizes="100vw"
          width={1920}
          height={2880}
          alt=""
          aria-hidden="true"
          onLoad={onLoad}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out motion-reduce:transition-none ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-2xl scale-110'
          }`}
        />
      ) : null}

      {/* Archive atmosphere - warm field in the text's negative space, photo kept clear */}
      <div aria-hidden="true" className="archive-hero-atmosphere" />

      <div className="archive-container relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <p className="mb-4"><DrawnText text={archiveMeta.author.name} /></p>

          <EditorialHeading
            as="h1"
            variant="editorial"
            className="!text-[clamp(2.4rem,6.5vw,5.5rem)] !leading-[1.05] !text-white tracking-tight"
          >
            {`${archiveMeta.author.currentFocus}.`}
          </EditorialHeading>

          <RolesWordmark
            text={archiveMeta.subtitle}
            className="mt-6 max-w-xl text-small sm:text-body-sm text-white/80 leading-relaxed"
          />
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-meta text-white/70 tracking-[0.3em] uppercase">Scroll</span>
        <span className="block w-px h-10 bg-white/25" />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
