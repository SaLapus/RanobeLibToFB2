import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import conditionalImport from "rollup-plugin-conditional-import";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig((config) => {
  return {
    define: {
      __TARGET__: `"${config.mode}"`,
    },
    // prevent vite from obscuring rust errors
    clearScreen: false,
    server: {
      // Tauri expects a fixed port, fail if that port is not available
      strictPort: true,
      // if the host Tauri is expecting is set, use it
      host: host ?? false,
      port: 5173,
    },
    // Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
    envPrefix: ["FIREBASE_", "VITE_", "TAURI_ENV_*"],
    build: {
      outDir: config.mode === "tauri" ? "dist/tauri" : "dist/web",
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target:
        process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
      // produce sourcemaps for debug builds
      // sourcemap: !!process.env.TAURI_ENV_DEBUG,
      sourcemap:
        !!process.env.TAURI_ENV_DEBUG || process.env.NODE_ENV !== "production",

      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("react")) return "react";
            if (id.includes("firebase") && config.mode === "web")
              return "firebase";
            if (id.includes("xmlbuilder2")) return "xml";

            return null;
          },
        },
        plugins: [
          conditionalImport({
            env: "__TARGET__",
          }),
        ],
      },
    },

    plugins: [
      react(),
      wyw({
        displayName: process.env.NODE_ENV !== "production",
      }),
    ],

    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["./src/tests/setup.ts"],
      include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
      exclude: ["node_modules", "dist"],
      reporters: ["verbose"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{js,jsx,ts,tsx}"],
        exclude: [
          "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
          "src/types/**",
          "src/tests/**",
        ],
      },
      server: {
        deps: {
          inline: ["jest-axe", "@testing-library/jest-dom"],
        },
      },

      testTimeout: 10000,
    },
  };
});
