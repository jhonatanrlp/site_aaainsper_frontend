import { api } from '../../lib/api/client.js';
import { env } from '../../lib/env.js';
import { supabaseAuth } from '../../lib/supabaseAuth.js';
import type { AuthProfile } from './types.js';

export function isAllowedEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${env.VITE_ALLOWED_EMAIL_DOMAIN.toLowerCase()}`);
}

export async function requestOtp(email: string): Promise<void> {
  const { error } = await supabaseAuth.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

export async function verifyOtp(email: string, code: string): Promise<void> {
  const { error } = await supabaseAuth.auth.verifyOtp({ email, token: code, type: 'email' });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  await supabaseAuth.auth.signOut();
}

// The real enforcement of "who is allowed to be a member" lives server-side
// (POST /auth/session/bootstrap re-checks the email domain) — this call is
// what turns a valid Supabase session into an authorized application user.
export async function bootstrapSession(): Promise<AuthProfile> {
  const { data, error } = await api.POST('/auth/session/bootstrap');
  if (error) throw new Error('Failed to bootstrap session');
  // The backend doesn't declare a response schema for this route yet (see
  // Checkpoint B report — only request shapes are wired into OpenAPI), so
  // openapi-fetch can't infer a body type here. Cast against the hand-kept
  // AuthProfile interface, which mirrors the controller's actual JSON.
  return data as unknown as AuthProfile;
}
