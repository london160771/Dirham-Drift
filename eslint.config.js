import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

const noRandom = {
  'no-restricted-properties': ['error', { object: 'Math', property: 'random', message: 'Use the seeded RNG (src/game/engine/rng.js).' }],
};

export default [
  { ignores: ['dist', 'node_modules', 'screenshots'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'no-warning-comments': ['error', { terms: ['todo', 'fixme', 'xxx'], location: 'anywhere' }],
    },
  },
  {
    files: ['src/game/**/*.js'],
    rules: noRandom,
  },
  {
    files: ['src/game/engine/**/*.js'],
    rules: {
      ...noRandom,
      'no-restricted-imports': ['error', { patterns: ['phaser', 'react', 'react-dom', '**/ui/**', '**/race/**'] }],
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'sessionStorage', 'fetch', 'navigator'],
    },
  },
];
