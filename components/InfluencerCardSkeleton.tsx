export default function InfluencerCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden skeleton-shimmer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      {/* Photo placeholder */}
      <div
        className="w-full"
        style={{ aspectRatio: '3/4', background: 'var(--skeleton-bg)' }}
      />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div
          className="h-5 rounded-lg w-3/4"
          style={{ background: 'var(--skeleton-bg)' }}
        />
        {/* Handle */}
        <div
          className="h-3.5 rounded-lg w-1/2"
          style={{ background: 'var(--skeleton-bg)' }}
        />
        {/* Category badge */}
        <div
          className="h-6 rounded-full w-2/5"
          style={{ background: 'var(--skeleton-bg)' }}
        />
        {/* Vote count */}
        <div
          className="h-4 rounded-lg w-1/3"
          style={{ background: 'var(--skeleton-bg)' }}
        />
        {/* Vote button */}
        <div
          className="h-11 rounded-xl w-full mt-2"
          style={{ background: 'var(--skeleton-bg)' }}
        />
      </div>
    </div>
  )
}
