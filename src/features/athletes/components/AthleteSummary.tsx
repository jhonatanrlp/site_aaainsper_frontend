import { CheckCircle2, FileWarning, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/card.js';
import { cn } from '../../../lib/cn.js';

export interface SummaryStats {
  teams: number;
  pendingRequests: number;
  documentsNeedingAction: number;
  registrations: number;
}

export function StatusBanner({ stats }: { stats: SummaryStats }) {
  let tone: 'info' | 'warning' | 'success';
  let title: string;
  let description: string;
  let Icon: LucideIcon;

  if (stats.documentsNeedingAction > 0) {
    tone = 'warning';
    Icon = FileWarning;
    title = 'Você tem documentos que precisam de ação';
    description = `${stats.documentsNeedingAction} ${
      stats.documentsNeedingAction === 1 ? 'documento aguarda' : 'documentos aguardam'
    } envio ou reenvio.`;
  } else if (stats.teams === 0) {
    tone = 'info';
    Icon = Info;
    title = 'Você ainda não faz parte de nenhuma equipe';
    description =
      stats.pendingRequests > 0
        ? 'Seu pedido de entrada está em análise pelo diretor da modalidade.'
        : 'Peça para entrar em uma equipe para começar.';
  } else {
    tone = 'success';
    Icon = CheckCircle2;
    title = 'Tudo em dia';
    description = 'Nenhuma pendência no momento.';
  }

  const styles = {
    info: 'border-[var(--color-brand-100)] bg-[var(--color-brand-50)] text-[var(--color-brand-800)]',
    warning:
      'border-[var(--color-warning-100)] bg-[var(--color-warning-100)]/60 text-[var(--color-warning-600)]',
    success:
      'border-[var(--color-success-100)] bg-[var(--color-success-100)]/60 text-[var(--color-success-600)]',
  }[tone];

  return (
    <div
      role="status"
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3.5', styles)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
}

function Tile({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <Card className="px-4 py-3.5">
      <p className="text-xs font-medium text-[var(--color-ink-subtle)]">{label}</p>
      <p
        className={cn(
          'mt-1 text-2xl font-semibold tabular-nums text-[var(--color-ink)]',
          highlight && 'text-[var(--color-warning-600)]',
        )}
      >
        {value}
      </p>
    </Card>
  );
}

export function SummaryTiles({ stats }: { stats: SummaryStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile label="Equipes" value={stats.teams} />
      <Tile label="Pedidos em análise" value={stats.pendingRequests} />
      <Tile
        label="Documentos com pendência"
        value={stats.documentsNeedingAction}
        highlight={stats.documentsNeedingAction > 0}
      />
      <Tile label="Inscrições" value={stats.registrations} />
    </div>
  );
}
