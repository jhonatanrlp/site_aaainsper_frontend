import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/client.js';
import { unwrap } from '../../lib/api/unwrap.js';

export interface Competition {
  id: string;
  name: string;
  season: string;
}

export type RegistrationStatus = 'draft' | 'confirmed' | 'cancelled';

export interface CompetitionRegistration {
  id: string;
  athleteId: string;
  competitionId: string;
  teamId: string | null;
  rankingLabel: string | null;
  status: RegistrationStatus;
  createdAt: string;
}

export const REGISTRATION_STATUS: Record<
  RegistrationStatus,
  { label: string; variant: 'neutral' | 'success' | 'danger' }
> = {
  draft: { label: 'Rascunho', variant: 'neutral' },
  confirmed: { label: 'Confirmada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
};

export function useCompetitions() {
  return useQuery({
    queryKey: ['competitions'],
    queryFn: () => unwrap<Competition[]>(api.GET('/competitions')),
  });
}
