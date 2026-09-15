import createClient, { type Middleware } from 'openapi-fetch';
import { env } from '../env.js';
import { supabaseAuth } from '../supabaseAuth.js';
import type { paths } from './schema.gen.js';

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const {
      data: { session },
    } = await supabaseAuth.auth.getSession();
    if (session?.access_token) {
      request.headers.set('Authorization', `Bearer ${session.access_token}`);
    }
    return request;
  },
};

// The single, typed entry point for every application data request. Typed
// end-to-end from the backend's OpenAPI document (see
// scripts/generate-api-types.mjs) — path, params, and request body are all
// checked against the real backend contract at compile time.
export const api = createClient<paths>({ baseUrl: env.VITE_API_BASE_URL });
api.use(authMiddleware);
