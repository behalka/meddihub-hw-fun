module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '(.spec|.e2e-spec).ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsConfig: 'tsconfig.local.json',
      },
    ],
  },

  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],
};
