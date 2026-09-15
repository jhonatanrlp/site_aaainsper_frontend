import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button.js';

export function ErrorScreen({
  message = 'Algo deu errado.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full min-h-64 w-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-danger-100)] text-[var(--color-danger-600)]">
        <AlertTriangle className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <p className="max-w-sm text-sm text-[var(--color-ink-muted)]">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
