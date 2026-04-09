import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const BoneyardSkeleton = ({ count = 1, height = 20, width = '100%' }) => (
  <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
    {Array(count).fill(0).map((_, i) => (
      <Skeleton key={i} height={height} width={width} className="mb-2" />
    ))}
  </SkeletonTheme>
);

const BoneyardShimmer = ({ children, loading }) => (
  <div className="relative">
    {children}
    {loading && (
      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-xl" style={{ backgroundSize: '200% 100%' }} />
    )}
  </div>
);

// Usage: <BoneyardSkeleton count={4} />
export default BoneyardSkeleton;
