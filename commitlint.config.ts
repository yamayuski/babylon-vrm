import type { UserConfig } from "@commitlint/types";

const config = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "body-max-line-length": [0],
    },
} satisfies UserConfig;

export default config;
