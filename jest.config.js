module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  globalTeardown: './jest.teardown.js',
};
