import '@testing-library/jest-dom/vitest';

// Safe dummy values so importing lib/env.ts never throws during tests —
// no test should depend on a real backend or Supabase project.
Object.assign(import.meta.env, {
  VITE_API_BASE_URL: 'http://localhost:3000',
  VITE_SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_ALLOWED_EMAIL_DOMAIN: 'al.insper.edu.br',
});
