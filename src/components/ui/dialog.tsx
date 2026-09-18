import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export function DialogContent({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
      <RadixDialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl outline-none">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <RadixDialog.Title className="text-base font-semibold text-[var(--color-ink)]">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Description className="mt-1 text-sm text-[var(--color-ink-muted)]">
              {description ?? ''}
            </RadixDialog.Description>
          </div>
          <RadixDialog.Close
            className="rounded-md p-1.5 text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
