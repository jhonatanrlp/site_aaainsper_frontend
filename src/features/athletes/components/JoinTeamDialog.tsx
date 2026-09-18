import { useState } from 'react';
import { toast } from 'sonner';
import { FormField, Select } from '../../../components/forms/controls.js';
import { Button } from '../../../components/ui/button.js';
import { Dialog, DialogContent } from '../../../components/ui/dialog.js';
import { ApiError } from '../../../lib/api/unwrap.js';
import { CATEGORY_LABEL, useModalities, useTeams } from '../../modalities/hooks.js';
import { useCreateJoinRequest } from '../hooks.js';

export function JoinTeamDialog({
  open,
  onOpenChange,
  takenTeamIds,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Teams the athlete already belongs to or has a pending request for.
  takenTeamIds: Set<string>;
}) {
  const [modalityId, setModalityId] = useState('');
  const [teamId, setTeamId] = useState('');
  const modalities = useModalities();
  const teams = useTeams(modalityId || undefined);
  const createRequest = useCreateJoinRequest();

  const activeModalities = (modalities.data ?? []).filter((modality) => modality.active);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!teamId) return;
    try {
      await createRequest.mutateAsync(teamId);
      toast.success('Pedido enviado — o diretor da modalidade vai analisar.');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Não foi possível enviar o pedido.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Entrar em uma equipe"
        description="Escolha a modalidade e a equipe. O diretor da modalidade aprova o pedido."
      >
        <form className="space-y-4" onSubmit={submit}>
          <FormField label="Modalidade" htmlFor="modality">
            <Select
              id="modality"
              value={modalityId}
              disabled={modalities.isPending}
              onChange={(event) => {
                setModalityId(event.target.value);
                setTeamId('');
              }}
            >
              <option value="">
                {modalities.isPending ? 'Carregando…' : 'Selecione uma modalidade'}
              </option>
              {activeModalities.map((modality) => (
                <option key={modality.id} value={modality.id}>
                  {modality.name} — {CATEGORY_LABEL[modality.category]}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Equipe"
            htmlFor="team"
            hint={
              modalityId && teams.data?.length === 0
                ? 'Esta modalidade ainda não tem equipes cadastradas.'
                : undefined
            }
            error={teams.isError ? 'Não foi possível carregar as equipes.' : undefined}
          >
            <Select
              id="team"
              value={teamId}
              disabled={!modalityId || teams.isPending}
              onChange={(event) => setTeamId(event.target.value)}
            >
              <option value="">
                {!modalityId
                  ? 'Escolha a modalidade primeiro'
                  : teams.isPending
                    ? 'Carregando…'
                    : 'Selecione uma equipe'}
              </option>
              {(teams.data ?? []).map((team) => (
                <option key={team.id} value={team.id} disabled={takenTeamIds.has(team.id)}>
                  {team.name}
                  {takenTeamIds.has(team.id) ? ' (já solicitado ou membro)' : ''}
                </option>
              ))}
            </Select>
          </FormField>

          {modalities.isError && (
            <p role="alert" className="text-sm text-[var(--color-danger-600)]">
              Não foi possível carregar as modalidades.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!teamId || createRequest.isPending}>
              {createRequest.isPending ? 'Enviando…' : 'Enviar pedido'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
