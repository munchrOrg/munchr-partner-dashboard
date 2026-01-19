import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import antfu from '@antfu/eslint-config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';
import tailwind from 'eslint-plugin-tailwindcss';

export default antfu(
  {
    react: true,
    nextjs: true,
    typescript: true,

    // Configuration preferences
    lessOpinionated: true,
    isInEditor: false,

    // Code style
    stylistic: {
      semi: true,
    },

    // Format settings
    formatters: {
      css: true,
      ts: true,
      tsx: true,
      json: true,
    },

    // Ignored paths
    ignores: [
      'migrations/**/*',
      'src/components/ui/**/*',
      '.next/**/*',
      'public/**/*',
      '.storybook/**/*',
      '.docs/**/*',
      '.vscode/**/*',
      '.husky/**/*',
      '.lintstagedrc.json',
      '.prettierignore',
      '.prettierrc',
      '.prettierignore',
    ],
  },
  // --- Accessibility Rules ---
  jsxA11y.flatConfigs.recommended,
  // --- Tailwind CSS Rules ---
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        config: `${dirname(fileURLToPath(import.meta.url))}/src/styles/global.css`,
      },
    },
  },
  // --- Storybook Rules ---
  ...storybook.configs['flat/recommended'],
  // --- Explicit Ignores ---
  {
    ignores: ['src/components/ui/**/*'],
  },
  // --- Custom Rule Overrides ---
  {
    rules: {
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'node/prefer-global/process': 'off', // Allow using `process.env`
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error
    },
  },
  // --- Allow interfaces in type definition files (needed for module augmentation) ---
  {
    files: ['**/*.d.ts'],
    rules: {
      'ts/consistent-type-definitions': 'off', // Allow interfaces in .d.ts files for module augmentation
    },
  },
);
