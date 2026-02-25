module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '(.spec|.e2e-spec).ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],
};
