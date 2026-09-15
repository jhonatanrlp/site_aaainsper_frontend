import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)]',
        brand: 'bg-[var(--color-brand-100)] text-[var(--color-brand-800)]',
        accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]',
        success: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
        warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
        danger: 'bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
