/// <reference types="vite/client" />

interface ViteTypeOptions {
    strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
    readonly NODE_ENV?: "development" | "production";
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
