
export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-slate-300 dark:bg-white/10 rounded w-1/2"></div>
      <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-2/3"></div>
    </div>
  );
}
