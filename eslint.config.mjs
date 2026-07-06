import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default ts.config(
  // 1. Global Ignores (replacing .eslintignore)
  {
    ignores: [
      '**/dist/',
      '**/build/',
      'node_modules/',
      'examples/angular/dist/',
      'scripts/',
      '*.config.js',
      '*.config.mjs',
      '**/*.json',
      '**/*.md',
      '**/*.html',
    ],
  },

  // 2. Base Configs
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,

  // 3. Language & Global Settings
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        jasmine: 'readonly',
        google: 'readonly',
      },
    },
  },

  // 4. Overrides for TS and JSX/TSX React components
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 5. Special rules for source files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'sort-imports': 'error',
    },
  },

  // 6. Base Rules for all files
  {
    rules: {
      'comma-dangle': ['error', 'only-multiline'],
      'quote-props': ['error', 'consistent'],
      'semi': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    },
  },
);
