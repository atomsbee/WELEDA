import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-md', className)}
      style={{ background: 'var(--bg-chip)' }}
      {...props}
    />
  )
}

export { Skeleton }
