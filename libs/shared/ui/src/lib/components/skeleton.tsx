/**
 * Skeleton loading primitives for dashboard pages.
 * Compose these to build page-specific skeleton layouts.
 */

interface SkeletonProps {
  className?: string;
}

/** Base shimmer rectangle — use className for sizing */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white/10 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/** Stat card skeleton — number + label */
export function SkeletonStatCard() {
  return (
    <div className="glass p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/** Row of stat card skeletons (responsive grid) */
export function SkeletonStatsRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

/** Hackathon card skeleton */
export function SkeletonHackathonCard() {
  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

/** List of hackathon card skeletons */
export function SkeletonHackathonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonHackathonCard key={i} />
      ))}
    </div>
  );
}

/** Team card skeleton */
export function SkeletonTeamCard() {
  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      {/* member avatars row */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}

/** Team card list skeletons */
export function SkeletonTeamList({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTeamCard key={i} />
      ))}
    </div>
  );
}

/** Profile section skeleton */
export function SkeletonProfileSection() {
  return (
    <div className="glass p-6 space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
      {/* Bio area */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      {/* Skills */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Notification row skeleton (for dropdown & page) */
export function SkeletonNotificationRow() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  );
}

/** Notification dropdown skeleton */
export function SkeletonNotificationDropdown({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonNotificationRow key={i} />
      ))}
    </div>
  );
}

/** Table skeleton (for leaderboard, participants, etc.) */
export function SkeletonTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="glass overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-white/10">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-4 border-b border-white/5">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
