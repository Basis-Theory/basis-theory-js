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
      coveragePathIgnorePatterns: [
        'src/encryption/providers',
        'src/encryption/BasisTheoryAesEncryptionService.ts',
      ],
    },
    {
      ...common,
      displayName: 'node',
      testEnvironment: 'node',
      coveragePathIgnorePatterns: [
        'src/encryption/providers',
        'src/encryption/BasisTheoryAesEncryptionService.ts',
      ],
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
