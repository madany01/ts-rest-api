// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path')

module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },

  plugins: ['@typescript-eslint', 'import'],

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: true,
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json'],
      },
      // alias: {
      //   map: [['@src', path.join(__dirname, 'src')]],
      //   extensions: ['.ts', '.js'],
      // },
    },
  },

  rules: {
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    'no-param-reassign': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-use-before-define': ['off', { functions: false }],
    'no-shadow': 'off',

    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.spec.ts'] },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          orderImportKind: 'asc',
        },
        // pathGroups: [
        //   {
        //     pattern: '@src/**/*',
        //     group: 'internal',
        //     position: 'before',
        //   },
        // ],
        groups: [
          ['builtin'],
          ['external'],
          ['internal', 'parent', 'sibling', 'index'],
          ['object'],
          ['type'],
        ],
      },
    ],
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-use-before-define': ['off', { functions: false }],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: false,
      },
    ],
  },
}
