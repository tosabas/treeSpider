module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['mjs', 'cjs', 'js', 'ts', 'jsx', 'tsx', 'json'],
    transform: {
        '^.+\\.(mjs|js|ts|jsx|tsx)$': 'babel-jest',
    },
};