module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
	},
	plugins: [
		'vue',
		'prettier'
	],
	extends: [
		"plugin:vue/essential",
		"eslint:recommended"
	],
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 6,
		sourceType: "module",
	},
	rules: {
		'prettier/prettier': 1,
		'no-empty': 0,
		'no-unused-vars': 1,
		'no-mixed-spaces-and-tabs': 0,
		'vue/multi-word-component-names': 0,
		'vue/no-unused-components': 1,
		'vue/no-reserved-keys': 1,
	}
}
