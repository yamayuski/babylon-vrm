import { defineConfig } from "rolldown";

export default defineConfig([
    {
        input: "src/index.ts",
        platform: "browser",
        output: [
            {
                format: "esm",
                sourcemap: true,
                file: "dist/esm/index.mjs",
                inlineDynamicImports: true,
                globals: (name) => /@babylonjs\//.test(name) && "BABYLON" || name,
            },
            {
                format: "cjs",
                sourcemap: true,
                file: "dist/cjs/index.cjs",
                inlineDynamicImports: true,
                globals: (name) => /@babylonjs\//.test(name) && "BABYLON" || name,
            },
            {
                format: "umd",
                name: "babylon-vrm-0",
                file: "dist/umd/index.js",
                sourcemap: true,
                inlineDynamicImports: true,
                globals: (name) => /@babylonjs\//.test(name) && "BABYLON" || name,
            },
        ],
        external: [
            /@babylonjs\//,
            /node_modules/,
        ],
    },
]);
