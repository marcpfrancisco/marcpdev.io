// @ts-check
import js from '@eslint/js';
import { configs as airbnb, plugins as airbnbPlugins } from 'eslint-config-airbnb-extended';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

const tsFiles = ['**/*.{ts,tsx,mts,cts}'];
const codeFiles = ['**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}'];

export default defineConfig(
  {
    name: 'workshop/ignores',
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'graphify-out/**',
      '.claude/**',
      'public/**',
      '.vercel/**',
    ],
  },
  {
    name: 'workshop/globals',
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Airbnb (base + React) with TypeScript support.
  js.configs.recommended,
  airbnbPlugins.stylistic,
  airbnbPlugins.importX,
  airbnbPlugins.typescriptEslint,
  ...airbnb.base.recommended,
  ...airbnb.base.typescript,
  airbnbPlugins.react,
  airbnbPlugins.reactA11y,
  airbnbPlugins.reactHooks,
  ...airbnb.react.recommended,
  ...airbnb.react.typescript,

  // typescript-eslint strict, type-aware, scoped to TS sources.
  ...tseslint.configs.strictTypeChecked.map((config) => ({ ...config, files: tsFiles })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({ ...config, files: tsFiles })),
  {
    name: 'workshop/typescript',
    files: tsFiles,
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // Astro components (includes jsx-a11y rules for markup).
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],

  {
    name: 'workshop/project-rules',
    files: codeFiles,
    rules: {
      // Google TS style: named exports over default exports.
      'import-x/prefer-default-export': 'off',
      'import-x/no-default-export': 'error',
      // Astro resolves virtual modules (astro:content, astro:assets) at build time.
      'import-x/no-unresolved': ['error', { ignore: ['^astro:'] }],
      'import-x/extensions': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
    },
  },
  {
    // Config files and Astro pages/layouts must default-export by framework contract.
    name: 'workshop/default-export-allowed',
    files: ['*.config.{js,mjs,ts}', 'src/pages/**/*.{ts,js}', 'src/content.config.ts'],
    rules: { 'import-x/no-default-export': 'off' },
  },

  // Formatting is owned by Prettier; turn off conflicting stylistic rules last.
  prettier,
);
