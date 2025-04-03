import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  { files: ["**/*.{ts,tsx}"], ignores: ["src-tauri/**"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,

      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylistic,
    ],
  },

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: "detect",
        defaultVersion: "18.3.1",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  }
);
