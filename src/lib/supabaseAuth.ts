import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Auth-only. Never import `.from(...)` / `.storage` anywhere in this app —
// all application data and files come from the backend API (see lib/api).
// This client's only job is OTP login, session refresh, and sign-out.
export const supabaseAuth = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
