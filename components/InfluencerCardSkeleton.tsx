export function InfluencerCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      {/* Photo area */}
      <div className="w-full aspect-square w-skeleton" />

      {/* Content */}
      <div className="p-3 md:p-4 space-y-3" style={{ background: 'var(--bg-card-inner)' }}>
        {/* Name */}
        <div className="w-skeleton h-4 rounded-lg" style={{ width: '75%' }} />
        {/* Handle */}
        <div className="w-skeleton h-3 rounded-lg" style={{ width: '50%' }} />
        {/* Tag pill */}
        <div className="w-skeleton h-6 rounded-full" style={{ width: '40%' }} />
        {/* Vote count row */}
        <div className="flex items-center gap-2">
          <div className="w-skeleton h-4 w-4 rounded-full flex-shrink-0" />
          <div className="w-skeleton h-4 rounded-lg" style={{ width: '64px' }} />
        </div>
        {/* Vote button */}
        <div className="w-skeleton h-10 rounded-full mt-1" />
      </div>
    </div>
  )
}

export function InfluencerGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-7">
      {Array.from({ length: 8 }).map((_, i) => (
        <InfluencerCardSkeleton key={i} />
      ))}
    </div>
  )
}
