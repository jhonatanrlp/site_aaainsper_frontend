import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button.js';
import { Card, CardBody, CardHeader } from '../../../components/ui/card.js';
import { formatDate } from '../../../lib/format.js';
import type { UserProfile } from '../../users/types.js';
import { EditProfileDialog } from './EditProfileDialog.js';

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-sm text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-[var(--color-ink)]">
        {value || '—'}
      </dd>
    </div>
  );
}

export function ProfileCard({ profile }: { profile: UserProfile }) {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <CardHeader
        title="Meus dados"
        action={
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
        }
      />
      <CardBody className="py-2">
        <dl className="divide-y divide-[var(--color-border)]">
          <Row label="Nome" value={profile.fullName} />
          <Row label="E-mail" value={profile.email} />
          <Row label="CPF" value={profile.cpfMask} />
          <Row label="RG" value={profile.rg} />
          <Row
            label="Nascimento"
            value={profile.birthDate ? formatDate(profile.birthDate) : null}
          />
          <Row label="Curso" value={profile.course} />
          <Row label="Instagram" value={profile.instagram ? `@${profile.instagram}` : null} />
          <Row label="Telefone" value={profile.phone} />
        </dl>
      </CardBody>
      {editing && <EditProfileDialog profile={profile} open onOpenChange={setEditing} />}
    </Card>
  );
}
