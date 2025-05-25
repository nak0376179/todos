// vitest.workspace.ts
import path from 'node:path';
import { defineWorkspace } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';

const dirname = path.resolve();

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    plugins: [
      storybookTest({ configDir: path.join(dirname, '.storybook') }),
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        provider: 'playwright',
        headless: true,
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  },
  {
    test: {
      name: 'unit',
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  },
]);