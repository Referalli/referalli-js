/* global process */
// Builds dist/esm (ES modules) and dist/cjs (CommonJS), each with .d.ts types.
// `referalli` types come from the core package's build (its workspace exports point at
// TypeScript source), which is built first if missing.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const tsc = require.resolve('typescript/bin/tsc');
const core = realpathSync(dirname(require.resolve('referalli/package.json')));
if (!existsSync(join(core, 'dist', 'esm', 'index.d.ts'))) execFileSync(process.execPath, [join(core, 'scripts', 'build.mjs')], { stdio: 'inherit' });

const react = realpathSync(dirname(require.resolve('@referalli/react/package.json')));
if (!existsSync(join(react, 'dist', 'esm', 'index.d.ts'))) execFileSync(process.execPath, [join(react, 'scripts', 'build.mjs')], { stdio: 'inherit' });

const types = relative(root, join(core, 'dist', 'esm'));
const reactTypes = relative(root, join(react, 'dist', 'esm'));
rmSync(join(root, 'dist'), { recursive: true, force: true });
for (const project of ['tsconfig.build.json', 'tsconfig.cjs.json']) {
  const tmp = join(root, `.${project}.tmp.json`);
  writeFileSync(
    tmp,
    JSON.stringify({
      extends: `./${project}`,
      compilerOptions: { paths: { referalli: [`${types}/index.d.ts`], 'referalli/*': [`${types}/*.d.ts`], '@referalli/react': [`${reactTypes}/index.d.ts`] } },
    }),
  );
  try {
    execFileSync(process.execPath, [tsc, '-p', tmp], { stdio: 'inherit' });
  } finally {
    rmSync(tmp, { force: true });
  }
}
for (const [dir, type] of [['esm', 'module'], ['cjs', 'commonjs']]) {
  mkdirSync(join(root, 'dist', dir), { recursive: true });
  writeFileSync(join(root, 'dist', dir, 'package.json'), `${JSON.stringify({ type }, null, 2)}\n`);
}
