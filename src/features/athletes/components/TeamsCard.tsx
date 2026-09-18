import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../../components/feedback/EmptyState.js';
import { Badge } from '../../../components/ui/badge.js';
import { Button } from '../../../components/ui/button.js';
import { Card, CardBody, CardHeader } from '../../../components/ui/card.js';
import { formatDate } from '../../../lib/format.js';
import { JOIN_REQUEST_STATUS, type JoinRequest, type Membership } from '../hooks.js';
import { JoinTeamDialog } from './JoinTeamDialog.js';

export function TeamsCard({
  memberships,
  requests,
}: {
  memberships: Membership[];
  requests: JoinRequest[];
}) {
  const [joining, setJoining] = useState(false);

  // Approved requests already show up as memberships — list only the rest.
  const openRequests = requests.filter((request) => request.status !== 'approved');
  const takenTeamIds = new Set<string>([
    ...memberships.map((membership) => membership.teamId),
    ...requests.filter((request) => request.status === 'pending').map((request) => request.teamId),
  ]);

  const isEmpty = memberships.length === 0 && openRequests.length === 0;

  return (
    <Card>
      <CardHeader
        title="Minhas equipes"
        action={
          <Button size="sm" onClick={() => setJoining(true)}>
            <Plus className="h-3.5 w-3.5" />
            Entrar em uma equipe
          </Button>
        }
      />
      {isEmpty ? (
        <EmptyState
          icon={Users}
          title="Nenhuma equipe ainda"
          description="Peça para entrar em uma equipe — o diretor da modalidade analisa o pedido."
        />
      ) : (
        <CardBody className="p-0">
          <ul className="divide-y divide-[var(--color-border)]">
            {memberships.map((membership) => (
              <li
                key={membership.teamId}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {membership.teamName}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{membership.modalityName}</p>
                </div>
                <Badge variant="success">Membro</Badge>
              </li>
            ))}
            {openRequests.map((request) => {
              const status = JOIN_REQUEST_STATUS[request.status];
              return (
                <li
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                      {request.teamName}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      {request.modalityName} · pedido em {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </li>
              );
            })}
          </ul>
        </CardBody>
      )}
      {joining && <JoinTeamDialog open onOpenChange={setJoining} takenTeamIds={takenTeamIds} />}
    </Card>
  );
}
