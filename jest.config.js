const common = {
  preset: 'ts-jest',
  automock: false,
  coveragePathIgnorePatterns: ['test', 'dist'],
  testPathIgnorePatterns: ['cypress'],
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'jsdom',
      testEnvironment: './test/setup/JsDomExtendedEnvironment.js',
    },
    {
      ...common,
      displayName: 'node',
      testEnvironment: 'node',
    },
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      lines: 80,
      functions: 80,
    },
  },
};
