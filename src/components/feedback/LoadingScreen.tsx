import { Loader2 } from 'lucide-react';

export function LoadingScreen({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-64 w-full flex-col items-center justify-center gap-3 text-[var(--color-ink-subtle)]">
      <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.25} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
