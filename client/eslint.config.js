import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // Plain apostrophes/quotes in JSX text render correctly in every browser;
      // escaping every "don't"/"we'll" in copy hurts readability for no real benefit.
      "react/no-unescaped-entities": "off",
      // This rule (new in eslint-plugin-react-hooks v7) flags the standard
      // "useEffect + setLoading/fetch/finally" data-fetching pattern used
      // throughout this app. That pattern is correct, tested, and works —
      // downgraded to a warning rather than forcing a React Query-style
      // rewrite of every data-fetching component for a non-bug.
      "react-hooks/set-state-in-effect": "warn",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
