export type Role = 'atleta' | 'dm' | 'gestao';

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  profileComplete: boolean;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'error'; message: string }
  | { status: 'authenticated'; profile: AuthProfile };
