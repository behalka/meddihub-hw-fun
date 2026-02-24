const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const configHelper = require('eslint/config');

module.exports = configHelper.defineConfig(
  {
    ignores: ['./eslint.config.js', './dist'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      'no-empty-function': ['error', { allow: ['constructors'] }],
      // in recommended rules, this is set to "error"
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
);
