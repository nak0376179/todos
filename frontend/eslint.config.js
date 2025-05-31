import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import storybook from 'eslint-plugin-storybook'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
  // 無視するファイル/ディレクトリ
  {
    ignores: [
      'vitest.shims.d.ts',
      'vite.config.js',
      'vitest.workspace.js',
      '.storybook/*',
      'vitest.config.ts',
      'eslint.config.js',
    ],
  },

  // JavaScript/TypeScriptファイル共通設定
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: globals.browser,
    },
  },

  // 推奨設定の読み込み（typescript-eslint、React、React Hooks、Vite対応のReact Refresh、Prettier、Storybook）
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  eslintConfigPrettier,
  ...storybook.configs['flat/recommended'],

  // カスタムルールの追加
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'storybook/prefer-pascal-case': 'off', // 日本語テスト名を許可するため
    },
  },
])
