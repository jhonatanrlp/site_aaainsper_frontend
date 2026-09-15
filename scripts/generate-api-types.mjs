#!/usr/bin/env node
// Regenerates src/lib/api/schema.gen.ts from the backend's live OpenAPI
// document. Run the backend locally first (npm run dev in
// site_aaainsper_backend), or pass API_URL to point elsewhere.
import { execSync } from 'node:child_process';

// Only ever set by a developer's own shell or CI config — not user input —
// so building the command string here (rather than execFileSync with
// shell:true + an args array, which Node flags as a footgun) is safe.
const baseUrl = process.env.API_URL ?? 'http://localhost:3000';

execSync(`npx openapi-typescript "${baseUrl}/docs/json" -o src/lib/api/schema.gen.ts`, {
  stdio: 'inherit',
});
