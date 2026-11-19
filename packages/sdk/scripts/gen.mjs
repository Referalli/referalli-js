/* global process */
// Regenerates the SDKs' typed layers from the API's live OpenAPI document (monorepo only):
// the api package's sdk-types/sdk-generated tests write them when UPDATE_SDK_TYPES/UPDATE_SDKS are set.
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const api = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'api');
execFileSync('pnpm', ['exec', 'vitest', 'run', 'test/sdk-types.test.ts', 'test/sdk-generated.test.ts'], {
  cwd: api,
  stdio: 'inherit',
  env: { ...process.env, UPDATE_SDK_TYPES: '1', UPDATE_SDKS: '1' },
});
