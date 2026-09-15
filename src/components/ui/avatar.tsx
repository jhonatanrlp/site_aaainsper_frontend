import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '../../lib/cn.js';

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex h-9 w-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-[var(--color-brand-800)] text-sm font-semibold text-white',
        className,
      )}
    >
      <RadixAvatar.Fallback>{initials || '?'}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
