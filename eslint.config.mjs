// College-ERP monorepo ESLint flat config (ESLint 9, flat config format).
//
// Layout this config targets:
//   backend/*   -> CommonJS Node services (Express, Mongoose)
//   shared/     -> CommonJS Node shared libs/middleware
//   frontend/*  -> ESM React 18 + JSX (Vite, browser)
//   **/tests/   -> Node built-in test runner
//
// Severity policy (requirement #9 — separate errors from warnings):
//   "error"  = correctness / bug-risk / likely-broken code  -> should block CI.
//   "warn"   = maintainability / code-smell / style          -> surfaced, non-blocking.
// This keeps the build green while still reporting every smell.

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default defineConfig([
  // ---------------------------------------------------------------------------
  // 0. Global ignores — never lint build artifacts or dependencies.
  // ---------------------------------------------------------------------------
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.timestamp-*", // Vite writes transient *.config.js.timestamp-*.mjs files
    ],
  },

  // ---------------------------------------------------------------------------
  // 1. Base layer — applies to ALL JS/JSX files in the repo.
  //    Carries the shared "code smell", maintainability, complexity, nesting,
  //    duplication and import-ordering rules. Area-specific layers below add
  //    language/globals tweaks on top.
  // ---------------------------------------------------------------------------
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      js,
      import: pluginImport,
      promise: pluginPromise,
      sonarjs,
      unicorn,
    },
    extends: ["js/recommended"], // ESLint's recommended ruleset + Prettier disables conflicts with formatting rules
    settings: {
      // Let eslint-plugin-import resolve Node-style paths for import/order grouping.
      "import/resolver": {
        node: { extensions: [".js", ".mjs", ".cjs", ".jsx"] },
      },
    },
    rules: {
      // === (1) CODE SMELLS — SonarJS + Unicorn bug/smell detectors ============
      "sonarjs/no-identical-functions": "error", // two functions with identical bodies = copy-paste bug/dup
      "sonarjs/no-identical-expressions": "error", // `a && a`, `x === x` — almost always a typo
      "sonarjs/no-all-duplicated-branches": "error", // if/else (or switch) whose branches are identical = dead logic
      "sonarjs/no-element-overwrite": "error", // writing the same collection key twice before reading = bug
      "sonarjs/no-use-of-empty-return-value": "error", // using the result of a function that returns nothing
      "sonarjs/no-redundant-boolean": "warn", // `x === true`, `!!cond ? ...` — noise
      "sonarjs/no-collapsible-if": "warn", // nested `if` that could be a single `&&`
      "sonarjs/no-small-switch": "warn", // a switch with <3 cases reads better as if/else
      "sonarjs/prefer-single-boolean-return": "warn", // `if (x) return true; return false;` -> `return x`
      "unicorn/no-instanceof-array": "error", // `x instanceof Array` breaks across realms; use Array.isArray
      "unicorn/error-message": "error", // `throw new Error()` with no message is undebuggable
      "unicorn/no-useless-spread": "warn", // `[...[a, b]]` / spreading into a fresh array needlessly
      "unicorn/prefer-array-some": "warn", // `.find(...) !== undefined` -> `.some(...)`
      "unicorn/throw-new-error": "error", // always `throw new Error()`, never `throw Error()`

      // === (2) MAINTAINABILITY — size/shape limits keep units reviewable ======
      "max-lines": [
        "warn",
        { max: 400, skipBlankLines: true, skipComments: true },
      ], // huge files resist change
      "max-lines-per-function": [
        "warn",
        { max: 80, skipBlankLines: true, skipComments: true },
      ], // long fns hide bugs
      "max-params": ["warn", 4], // >4 params -> pass an options object instead
      "max-statements": ["warn", 25], // too many statements in one fn = doing too much
      "no-nested-ternary": "warn", // stacked `?:` is hard to read
      "no-else-return": "warn", // `else` after `return` is dead structure
      "prefer-const": "error", // never `let` a value that is never reassigned
      "no-var": "error", // `var` is hoisting/scoping footgun; use let/const
      eqeqeq: ["error", "smart"], // `==` does surprising coercion; require `===`

      // === (3) COGNITIVE COMPLEXITY ==========================================
      "sonarjs/cognitive-complexity": ["warn", 15], // SonarJS metric: weighted nesting+branching effort to read
      complexity: ["warn", 12], // classic cyclomatic complexity (independent paths) ceiling

      // === (4) NESTING DEPTH =================================================
      "max-depth": ["warn", 4], // blocks nested deeper than 4 -> extract a function
      "max-nested-callbacks": ["warn", 3], // callback pyramids; flatten with async/await or named fns

      // === (5) DUPLICATE CODE PATTERNS =======================================
      "sonarjs/no-duplicate-string": ["warn", { threshold: 4 }], // same literal 4+ times -> hoist to a const
      "no-dupe-keys": "error", // duplicate object keys silently overwrite (core, but called out here)

      // === (6) IMPORT ORDERING / HYGIENE =====================================
      "import/order": [
        "warn",
        {
          // builtin (node:fs) -> external (express) -> internal (../utils) ...
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always", // blank line between groups for scanability
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error", // merge two imports from the same module
      "import/no-self-import": "error", // a module importing itself = mistake
      "import/newline-after-import": "warn", // blank line after the import block

      // === PROMISES — async correctness =======================================
      "promise/no-return-wrap": "error", // `return Promise.resolve(x)` inside async -> just `return x`
      "promise/param-names": "error", // resolve/reject must be named correctly
      "promise/no-nesting": "warn", // nested `.then()` chains -> flatten
    },
  },

  // ---------------------------------------------------------------------------
  // 2. Backend services + shared libs — CommonJS, Node runtime.
  // ---------------------------------------------------------------------------
  {
    files: ["backend/**/*.js", "shared/**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // these use require()/module.exports
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "off", // server logging via console is acceptable in services
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Frontend portals — ESM, React 18 + JSX, browser runtime.
  // ---------------------------------------------------------------------------
  {
    files: ["frontend/**/*.{js,jsx}"],
    languageOptions: {
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } }, // silence "React version not specified"
    plugins: {
      react: pluginReact,
      "react-hooks": reactHooks,
    },
    rules: {
      // Start from the React recommended preset (keeps react/jsx-uses-vars etc. ...
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off", // React 17+/Vite automatic JSX runtime — no import React needed
      "react/jsx-uses-react": "off", // same reason — the runtime references React for us
      "react/prop-types": "off", // project does not use the prop-types library
      "react-hooks/rules-of-hooks": "error", // calling hooks conditionally breaks React — hard error
      "react-hooks/exhaustive-deps": "warn", // missing effect deps cause stale closures — warn, can be intentional
      "no-console": "warn", // stray console.log shouldn't ship to the browser bundle
    },
  },

  // ---------------------------------------------------------------------------
  // 3b. Build / tooling / infra scripts — Node CommonJS regardless of folder.
  //     (vite configs, pm2 ecosystem, codegen scripts live outside backend/.)
  // ---------------------------------------------------------------------------
  {
    files: [
      "**/*.config.{js,cjs,mjs}",
      "**/vite.config.js",
      "infrastructure/**/*.js",
      "*.js",
    ],
    // Only inject Node globals — don't force a sourceType, since these files are
    // a mix of ESM (eslint/vite configs) and CommonJS (pm2/codegen scripts).
    // globals.node provides require/module/__dirname so CJS files stop erroring.
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // ---------------------------------------------------------------------------
  // 4. Tests — Node built-in test runner; relax size/complexity limits.
  // ---------------------------------------------------------------------------
  {
    files: ["**/tests/**/*.{js,jsx}", "**/*.test.{js,jsx}"],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "max-lines-per-function": "off", // test blocks are legitimately long
      "max-statements": "off",
      "sonarjs/no-duplicate-string": "off", // repeated fixture strings are fine in tests
      "sonarjs/cognitive-complexity": "off",
    },
  },

  // ---------------------------------------------------------------------------
  // 5. Shared no-unused-vars policy (intentional placeholders allowed).
  // ---------------------------------------------------------------------------
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // unused args prefixed with _ are intentional (e.g. Express _next)
          varsIgnorePattern: "^_",
          caughtErrors: "none", // unused catch bindings are fine
          ignoreRestSiblings: true, // `const { drop, ...keep } = obj` to strip a field
        },
      ],
    },
  },
]);
