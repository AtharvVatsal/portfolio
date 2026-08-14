import React from 'react';

const shimmer = 'bg-notebook-border/50';

const scanAnimation = {
  animation: 'scanPulse 2s ease-in-out infinite',
};

export const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${shimmer} ${width} ${height} rounded-sm ${className}`} style={scanAnimation} />
);

export const ArticleSkeleton = () => (
  <div className="space-y-6 py-4" style={scanAnimation}>
    {/* Document header reference line */}
    <div className="flex items-center gap-3 mb-6">
      <SkeletonLine width="w-24" height="h-3" />
      <SkeletonLine width="w-16" height="h-3" />
      <SkeletonLine width="w-20" height="h-3" />
    </div>

    <SkeletonLine width="w-3/4" height="h-7" />

    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine width="w-11/12" />
      <SkeletonLine width="w-4/5" />
    </div>

    <SkeletonLine width="w-1/2" height="h-6" className="mt-4" />

    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine width="w-10/12" />
      <SkeletonLine />
      <SkeletonLine width="w-3/4" />
    </div>

    <div className={`${shimmer} w-full h-32 rounded-sm`} style={scanAnimation} />

    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine width="w-5/6" />
      <SkeletonLine width="w-9/12" />
    </div>

    <SkeletonLine width="w-2/5" height="h-6" className="mt-4" />

    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine width="w-11/12" />
      <SkeletonLine width="w-3/4" />
      <SkeletonLine width="w-4/5" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="border border-notebook-border overflow-hidden" style={scanAnimation}>
    <div className={`${shimmer} w-full h-48`} style={scanAnimation} />

    <div className="p-6 space-y-3">
      <SkeletonLine width="w-1/4" height="h-3" />
      <SkeletonLine width="w-full" height="h-5" />
      <SkeletonLine width="w-3/4" height="h-5" />
      <div className="space-y-2 pt-2">
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-2/3" height="h-3" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-notebook-border">
        <SkeletonLine width="w-20" height="h-3" />
        <SkeletonLine width="w-16" height="h-3" />
      </div>
    </div>
  </div>
);

export const GalleryImageSkeleton = ({ className = '' }) => (
  <div className={`${shimmer} w-full h-full min-h-[200px] rounded-sm ${className}`} style={scanAnimation} />
);

export const CoverImageSkeleton = () => (
  <div className={`${shimmer} w-full h-[40vh] sm:h-[50vh] md:h-[60vh]`} style={scanAnimation}>
    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-16">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <SkeletonLine width="w-20" height="h-7" />
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
