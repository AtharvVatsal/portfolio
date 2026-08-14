import React, { useState, useCallback } from 'react';
import { galleryPhotos } from '../../data/gallery';
import { getGalleryImageUrl } from '../../config/cloudinary';

const PhotoMoment = ({ photoId, caption, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const photo = galleryPhotos.find(p => p.id === photoId) || galleryPhotos[0];
  const url = photo ? getGalleryImageUrl(photo.publicId) : null;
  const onLoad = useCallback(() => setLoaded(true), []);

  if (!photo) return null;

  return (
    <div className={`relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-neutral-950 ${className}`}>
      {url && !error ? (
        <img
          src={url.full}
          alt={photo.title}
          onLoad={onLoad}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-[1500ms] ${
            loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-2xl'
          }`}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-950" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
      {caption && (
        <div className={`absolute bottom-6 sm:bottom-8 left-6 sm:left-8 lg:left-12 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="font-mono text-[0.8rem] text-white/60 tracking-wider">{caption}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoMoment;
