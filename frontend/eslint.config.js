// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default [// TypeScript + React 用設定
{ ignores: ['dist', 'node_modules'] }, {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json', // プロジェクト直下に tsconfig.json が必要
      tsconfigRootDir: process.cwd(),
      sourceType: 'module',
    },
    globals: globals.browser,
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier: prettier,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...eslintConfigPrettier.rules,
    'prettier/prettier': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-unused-vars': 'off', // JS側ルールを無効にし、
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }], // TS側で管理
  },
}, ...storybook.configs["flat/recommended"], ...storybook.configs["flat/recommended"], ...storybook.configs["flat/recommended"]];
