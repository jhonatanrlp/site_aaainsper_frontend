import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client.js';
import { unwrap } from '../../lib/api/unwrap.js';
import type { UserProfile } from './types.js';

export const profileKey = ['users', 'me'] as const;

export function useProfile() {
  return useQuery({
    queryKey: profileKey,
    queryFn: () => unwrap<UserProfile>(api.GET('/users/me')),
  });
}

export interface ProfileUpdate {
  fullName?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  course?: string;
  instagram?: string;
  phone?: string;
}

// Partial update — only the fields present in `body` are changed server-side.
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProfileUpdate) => unwrap<UserProfile>(api.PATCH('/users/me', { body })),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKey, profile);
    },
  });
}
