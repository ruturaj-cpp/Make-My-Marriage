import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const monorepoRoot = resolve(process.cwd(), '../..');
  const env = loadEnv(mode, monorepoRoot, '');

  return {
    envDir: monorepoRoot,
    plugins: [react(), tailwindcss()],
    server: { port: Number(env.WEB_PORT) || 5173 },
    test: { environment: 'jsdom', setupFiles: './src/test-setup.ts' },
  };
});
