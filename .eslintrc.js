module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier"], // Uses the linting rules from @typescript-eslint/eslint-plugin
  env: {
    node: true,
  },
  ignorePatterns: ["dist"],
  rules: {
    semi: ["error", "always"],
  },
};
