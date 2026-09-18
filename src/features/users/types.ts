import type { Role } from '../auth/types.js';

// Hand-kept mirror of the backend's UserProfileResponse (the backend doesn't
// declare response schemas in OpenAPI yet). Raw CPF never appears here — the
// API only ever returns a masked value.
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  cpfMask: string | null;
  rg: string | null;
  birthDate: string | null;
  course: string | null;
  instagram: string | null;
  phone: string | null;
  role: Role;
  active: boolean;
}
