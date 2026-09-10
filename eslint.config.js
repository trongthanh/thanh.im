import js from "@eslint/js";
import globals from "globals";

export default [
	{
		ignores: ["slides/", "_site/"],
	},
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node,
			},
		},
		rules: {
			...js.configs.recommended.rules,
			"no-console": "off",
		},
	},
];
