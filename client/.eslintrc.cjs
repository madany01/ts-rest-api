module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',

    'airbnb',
    'airbnb-typescript',

    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',

    'plugin:@typescript-eslint/recommended',

    'plugin:prettier/recommended',
  ],

  plugins: ['react', '@typescript-eslint'],

  root: true,

  overrides: [],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },

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
    },
  },

  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    // 'no-param-reassign': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-use-before-define': ['off', { functions: false }],

    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
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

    // 'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/button-has-type': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-no-useless-fragment': 'off',

    'import/prefer-default-export': 'off',
    // 'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.spec.ts'] }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          orderImportKind: 'asc',
        },
        groups: [['builtin'], ['external'], ['internal', 'parent', 'sibling', 'index'], ['object'], ['type']],
      },
    ],
  },
}
