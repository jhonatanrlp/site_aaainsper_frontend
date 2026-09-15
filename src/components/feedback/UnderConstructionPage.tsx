import { Hammer } from 'lucide-react';
import { EmptyState } from './EmptyState.js';

// Placeholder for sections not yet built in this checkpoint — real screens
// land in the following steps (área do atleta, DM, gestão, loja, ECONO).
export function UnderConstructionPage({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-white">
      <EmptyState
        icon={Hammer}
        title={`${label} — em construção`}
        description="Esta área será implementada nas próximas etapas do Checkpoint C."
      />
    </div>
  );
}
