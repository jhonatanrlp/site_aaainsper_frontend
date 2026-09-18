import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/client.js';
import { unwrap } from '../../lib/api/unwrap.js';

export interface Modality {
  id: string;
  name: string;
  sport: string;
  category: 'masculino' | 'feminino' | 'misto';
  active: boolean;
}

export interface Team {
  id: string;
  modalityId: string;
  name: string;
}

export const CATEGORY_LABEL: Record<Modality['category'], string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  misto: 'Misto',
};

export function useModalities() {
  return useQuery({
    queryKey: ['modalities'],
    queryFn: () => unwrap<Modality[]>(api.GET('/modalities')),
  });
}

export function useTeams(modalityId: string | undefined) {
  return useQuery({
    queryKey: ['modalities', modalityId, 'teams'],
    queryFn: () =>
      unwrap<Team[]>(
        api.GET('/modalities/{id}/teams', { params: { path: { id: modalityId as string } } }),
      ),
    enabled: Boolean(modalityId),
  });
}
