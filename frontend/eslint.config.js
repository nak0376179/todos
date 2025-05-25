import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import storybook from 'eslint-plugin-storybook'
import parser from '@typescript-eslint/parser' // ✅ JSX 対応のためのパーサー

export default tseslint.config(
  { ignores: ['dist'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser,
      parser, // ✅ JSX を有効にする
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {}, // ❌ 削除してOK
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // ✅ JSX で React import 不要に      
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  {
    files: ['*.stories.ts', '*.stories.tsx'],
    plugins: { storybook },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  }
)
