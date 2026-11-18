import { withLight } from '../../vitest.shared.js';

export default withLight({
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', environmentOptions: { jsdom: { url: 'https://shop.example/' } }, setupFiles: ['./test/setup.ts'] },
});
