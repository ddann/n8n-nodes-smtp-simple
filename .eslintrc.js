module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/dist/**',
		'**/node_modules/**',
	],

	extends: [
		'plugin:n8n-nodes-base/community',
	],

	rules: {
		'n8n-nodes-base/node-param-default-missing': 'error',
		'n8n-nodes-base/node-param-description-missing': 'error',
		'n8n-nodes-base/node-param-display-name-missing': 'error',
		'n8n-nodes-base/node-param-type-options-missing': 'error',
	},
};