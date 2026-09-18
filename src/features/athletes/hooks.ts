import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client.js';
import { unwrap } from '../../lib/api/unwrap.js';
import type { CompetitionRegistration } from '../competitions/hooks.js';
import type { AthleteDocument } from '../documents/hooks.js';

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface Membership {
  teamId: string;
  teamName: string;
  modalityId: string;
  modalityName: string;
}

export interface JoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  modalityId: string;
  modalityName: string;
  status: JoinRequestStatus;
  createdAt: string;
}

export interface AthleteDetail {
  athleteId: string;
  userId: string;
  fullName: string | null;
  email: string;
  cpfMask: string | null;
  rg: string | null;
  birthDate: string | null;
  course: string | null;
  instagram: string | null;
  phone: string | null;
  memberships: Membership[];
  pendingRequests: JoinRequest[];
  documents: AthleteDocument[];
  competitionRegistrations: CompetitionRegistration[];
}

export const JOIN_REQUEST_STATUS: Record<
  JoinRequestStatus,
  { label: string; variant: 'brand' | 'success' | 'danger' }
> = {
  pending: { label: 'Em análise', variant: 'brand' },
  approved: { label: 'Aprovado', variant: 'success' },
  rejected: { label: 'Recusado', variant: 'danger' },
};

interface MyAthlete {
  athlete: { id: string; userId: string } | null;
  teamIds: string[];
}

export function useMyAthlete() {
  return useQuery({
    queryKey: ['athletes', 'me'],
    queryFn: () => unwrap<MyAthlete>(api.GET('/athletes/me')),
  });
}

export function useAthleteDetail(athleteId: string | undefined) {
  return useQuery({
    queryKey: ['athletes', athleteId],
    queryFn: () =>
      unwrap<AthleteDetail>(
        api.GET('/athletes/{id}', { params: { path: { id: athleteId as string } } }),
      ),
    enabled: Boolean(athleteId),
  });
}

export function useCreateJoinRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) =>
      unwrap<JoinRequest>(api.POST('/team-join-requests', { body: { teamId } })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['athletes'] }),
  });
}
