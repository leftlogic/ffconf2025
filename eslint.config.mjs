import globals from 'globals';
import css from '@eslint/css';
import html from '@html-eslint/eslint-plugin';
import compat from 'eslint-plugin-compat';

const available = 2019;

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
      // note that `tolerant: true` is for "custom syntax", it's just that
      // nesting validation isn't there yet: https://git.new/Xw6rUGH
      tolerant: true,
    },
  },
  {
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    rules: {
      'css/use-baseline': [
        'warn',
        {
          available,
        },
      ],
    },
  },
  {
    ...html.configs['flat/recommended'],
    files: ['**/*.html'],
    rules: {
      '@html-eslint/use-baseline': [
        'warn',
        {
          available,
        },
      ],
    },
  },
  {
    ...compat.configs['flat/recommended'],
    settings: {
      lintAllEsApis: true,
    },
    rules: {
      'compat/compat': ['warn'],
    },
  },
];
