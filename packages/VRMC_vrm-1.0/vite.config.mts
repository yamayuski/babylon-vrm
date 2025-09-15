import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src", "index.ts"),
        },
        rollupOptions: {
            output: [
                {
                    format: "esm",
                    dir: resolve(__dirname, "dist", "esm"),
                    inlineDynamicImports: true,
                    globals: (name) => (/@babylonjs\//.test(name) && "BABYLON") || name,
                },
                {
                    format: "cjs",
                    dir: resolve(__dirname, "dist", "cjs"),
                    inlineDynamicImports: true,
                    globals: (name) => (/@babylonjs\//.test(name) && "BABYLON") || name,
                },
                {
                    format: "umd",
                    name: "babylon-vrm-1-0",
                    dir: resolve(__dirname, "dist", "umd"),
                    inlineDynamicImports: true,
                    globals: (name) => (/@babylonjs\//.test(name) && "BABYLON") || name,
                },
            ],
            external: [/@babylonjs\//, /node_modules/],
        },
    },
});
