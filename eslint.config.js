/* eslint-env node */
import eslint from "@eslint/js"
import solid from "eslint-plugin-solid"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    solid.configs["flat/typescript"],
    ...tseslint.configs.recommended
  ),
  eslintConfigPrettier
]
