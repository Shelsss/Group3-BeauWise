const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactPlugin = require('eslint-plugin-react');

const reactNativePlugin = require('eslint-plugin-react-native');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
	expoConfig,
	reactPlugin.configs.flat['jsx-runtime'],
	eslintPluginPrettierRecommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['dist/*'],
		rules: {
			'no-console': 'error',
			'react/boolean-prop-naming': 'warn',
			'react/hook-use-state': 'error',
			'react/jsx-pascal-case': 'error',
			'react/no-array-index-key': 'warn',
			'react-native/no-unused-styles': 'error',
			'react-native/no-raw-text': 'warn',

			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto'
				}
			]
		},

		plugins: { 'react-native': reactNativePlugin },
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		}
	}
]);
