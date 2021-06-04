const common = {
  preset: 'ts-jest',
  automock: false,
  setupFiles: ['<rootDir>/test/setup/setupJest.ts'],
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'jsdom',
      testEnvironment: './test/setup/JSDOMExtendedEnvironment.js',
      coveragePathIgnorePatterns: ['src/encryption/providers'],
    },
    {
      ...common,
      displayName: 'node',
      testEnvironment: 'node',
      coveragePathIgnorePatterns: ['src/encryption/providers'],
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
