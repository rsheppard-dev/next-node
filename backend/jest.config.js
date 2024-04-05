/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/**/*.test.ts'],
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
