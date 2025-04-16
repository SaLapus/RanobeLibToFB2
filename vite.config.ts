import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig((config) => {
  console.log(config);
  
  return {
    // prevent vite from obscuring rust errors
    define: {
      __TARGET__: config.mode,
    },
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
      sourcemap: process.env.NODE_ENV !== "production",

      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            firebase: ["firebase/app", "firebase/analytics"],
            xml: ["xmlbuilder2"],
          },
        },
      },
    },

    plugins: [
      react(),
      wyw({
        displayName: process.env.NODE_ENV !== "production",
      }),
    ],
  };
});
