export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <div className="text-center space-y-6">
        {/* Pulsing wordmark */}
        <p
          className="text-2xl font-black tracking-widest skeleton-shimmer"
          style={{ color: 'var(--text-primary)' }}
        >
          WELEDA
        </p>

        {/* 3 bouncing dots in brand colours */}
        <div className="flex items-center justify-center gap-2">
          {(['#F472B6', '#FBBF24', '#60A5FA'] as const).map((color, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: color,
                animation: `loaderBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
