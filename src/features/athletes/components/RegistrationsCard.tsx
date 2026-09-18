import { Trophy } from 'lucide-react';
import { EmptyState } from '../../../components/feedback/EmptyState.js';
import { Badge } from '../../../components/ui/badge.js';
import { Card, CardBody, CardHeader } from '../../../components/ui/card.js';
import {
  REGISTRATION_STATUS,
  useCompetitions,
  type CompetitionRegistration,
} from '../../competitions/hooks.js';

export function RegistrationsCard({ registrations }: { registrations: CompetitionRegistration[] }) {
  const competitions = useCompetitions();
  const nameById = new Map((competitions.data ?? []).map((c) => [c.id, `${c.name} ${c.season}`]));

  return (
    <Card>
      <CardHeader title="Inscrições em competições" />
      {registrations.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Nenhuma inscrição ainda"
          description="Quando o diretor da sua modalidade inscrever você em uma competição, ela aparece aqui."
        />
      ) : (
        <CardBody className="p-0">
          <ul className="divide-y divide-[var(--color-border)]">
            {registrations.map((registration) => {
              const status = REGISTRATION_STATUS[registration.status];
              return (
                <li
                  key={registration.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                      {nameById.get(registration.competitionId) ?? 'Competição'}
                    </p>
                    {registration.rankingLabel && (
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {registration.rankingLabel}
                      </p>
                    )}
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </li>
              );
            })}
          </ul>
        </CardBody>
      )}
    </Card>
  );
}
