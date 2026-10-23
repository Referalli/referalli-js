import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', environmentOptions: { jsdom: { url: 'https://shop.example/' } }, setupFiles: ['./test/setup.ts'] },
});
