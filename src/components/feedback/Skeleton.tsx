import { cn } from '../../lib/cn.js';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-[var(--color-border)]/70', className)}
    />
  );
}
