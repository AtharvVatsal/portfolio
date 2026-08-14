import React, { useState, useMemo } from 'react';
import { galleryPhotos } from '../../data';
import { getGalleryImageUrl } from '../../config/cloudinary';

const PhotoReference = ({
  photoId,
  caption,
  context,
  showExif = true,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const photo = useMemo(() => {
    if (photoId) {
      return galleryPhotos.find((p) => p.id === photoId);
    }
    // Pick a random featured photo if no ID given
    const featured = galleryPhotos.filter((p) => p.featured);
    return featured[Math.floor(Math.random() * featured.length)];
  }, [photoId]);

  if (!photo) return null;

  const urls = getGalleryImageUrl(photo.publicId);

  return (
    <figure
      className={`relative my-8 ${className}`}
      onMouseEnter={() => setIsInView(true)}
    >
      {/* Photo */}
      <div className="relative overflow-hidden border border-notebook-border bg-notebook-surface">
        <img
          src={isLoaded ? urls.thumbnail : urls.placeholder}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`
            w-full object-cover transition-all duration-700
            ${isLoaded ? 'opacity-100 blur-0' : 'opacity-40 blur-sm'}
          `}
          style={{ maxHeight: '400px' }}
        />
      </div>

      {/* Caption bar */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        {/* Left: Title + context */}
        <div className="flex-1 min-w-0">
          <figcaption className="font-mono text-meta text-ink-secondary tracking-wide">
            <span className="text-blueprint/50 mr-1.5">FIG.</span>
            {photo.title}
          </figcaption>
          {(caption || photo.description) && (
            <p className="mt-2 max-reading text-body-sm text-ink-muted">
              {caption || photo.description}
            </p>
          )}
          {context && (
            <p className="mt-1 font-mono text-meta text-ink-faint/70 italic">
              {context}
            </p>
          )}
        </div>

        {/* Right: EXIF data */}
        {showExif && (
          <div className="meta-label text-ink-faint/70 flex flex-wrap gap-x-3 gap-y-0.5 shrink-0">
            <span>{photo.settings.aperture}</span>
            <span>{photo.settings.shutter}</span>
            <span>ISO {photo.settings.iso}</span>
            <span>{photo.settings.focalLength}</span>
          </div>
        )}
      </div>

      {/* Location + date */}
      <div className="mt-2 font-mono text-meta text-ink-faint/70 tracking-wider">
        {photo.location} Â· {photo.date}
      </div>
    </figure>
  );
};

export default PhotoReference;
