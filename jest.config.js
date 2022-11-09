module.exports = {
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '\\.(css|less|sass|scss)$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
};
