import React from 'react';

// Base shimmer pulse
const shimmer = 'animate-pulse bg-white/5 rounded';

// Single line placeholder
export const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${shimmer} ${width} ${height} ${className}`} />
);

// Blog article content skeleton
export const ArticleSkeleton = () => (
  <div className="space-y-6 py-4">
    {/* Heading */}
    <SkeletonLine width="w-3/4" height="h-7" />
    
    {/* Paragraph block 1 */}
    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine width="w-11/12" />
      <SkeletonLine width="w-4/5" />
    </div>

    {/* Sub-heading */}
    <SkeletonLine width="w-1/2" height="h-6" className="mt-4" />

    {/* Paragraph block 2 */}
    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine width="w-10/12" />
      <SkeletonLine />
      <SkeletonLine width="w-3/4" />
    </div>

    {/* Code block placeholder */}
    <div className={`${shimmer} w-full h-32 rounded-xl`} />

    {/* Paragraph block 3 */}
    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine width="w-5/6" />
      <SkeletonLine width="w-9/12" />
    </div>

    {/* Sub-heading */}
    <SkeletonLine width="w-2/5" height="h-6" className="mt-4" />

    {/* Paragraph block 4 */}
    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine width="w-11/12" />
      <SkeletonLine width="w-3/4" />
      <SkeletonLine width="w-4/5" />
    </div>
  </div>
);

// Blog card skeleton (for blog listing page)
export const BlogCardSkeleton = () => (
  <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
    {/* Cover image placeholder */}
    <div className={`${shimmer} w-full h-48`} />
    
    {/* Content */}
    <div className="p-6 space-y-3">
      <SkeletonLine width="w-1/4" height="h-3" />
      <SkeletonLine width="w-full" height="h-5" />
      <SkeletonLine width="w-3/4" height="h-5" />
      <div className="space-y-2 pt-2">
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-2/3" height="h-3" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <SkeletonLine width="w-20" height="h-3" />
        <SkeletonLine width="w-16" height="h-3" />
      </div>
    </div>
  </div>
);

// Gallery image skeleton
export const GalleryImageSkeleton = ({ className = '' }) => (
  <div className={`${shimmer} rounded-2xl w-full h-full min-h-[200px] ${className}`} />
);

// Cover image skeleton for blog post hero
export const CoverImageSkeleton = () => (
  <div className={`${shimmer} w-full h-[40vh] sm:h-[50vh] md:h-[60vh]`}>
    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-16">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <SkeletonLine width="w-20" height="h-7" className="rounded-full" />
          <SkeletonLine width="w-24" height="h-4" />
          <SkeletonLine width="w-20" height="h-4" />
        </div>
        <SkeletonLine width="w-3/4" height="h-10" />
        <SkeletonLine width="w-1/2" height="h-10" />
      </div>
    </div>
  </div>
);

export default ArticleSkeleton;