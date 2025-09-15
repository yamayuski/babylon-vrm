import type { Stats } from "node:fs";
import { glob, mkdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import type { JSONSchema } from "json-schema-to-typescript/dist/src/types/JSONSchema";

/**
 * List all files in a directory recursively.
 * @param fromDir Directory to list files from
 */
export async function* listFiles(fromDir: string): AsyncGenerator<string> {
    for await (const entry of glob("**/*", { cwd: fromDir })) {
        const srcPath = join(fromDir, entry);
        const stats = await stat(srcPath);
        if (stats.isFile()) {
            yield srcPath;
        }
    }
}

/**
 * Validate that the source directory exists, is a directory, and contains .json files.
 * @param directory Directory to validate
 */
export async function throwIfInvalidSrc(directory: string) {
    let statDir: Stats;
    try {
        statDir = await stat(directory);
    } catch (_err) {
        throw new Error(`Schema source directory not found or unreadable: ${directory}`);
    }

    if (!statDir.isDirectory()) {
        throw new Error(`Schema source is not a directory: ${directory}`);
    }
}

/**
 * Ensure that the directory is clean (deleted and recreated).
 * @param directory Directory to ensure is clean
 */
export async function ensureDirectoryHasCleaned(directory: string) {
    await rm(directory, { recursive: true, force: true });
    await mkdir(directory, { recursive: true });
}

/**
 * Read and validate a JSON schema file.
 * @param filePath Path to the JSON schema file
 * @returns The parsed JSON schema
 */
export async function readJSONSchema(filePath: string): Promise<JSONSchema> {
    const schema = await import(filePath);
    if (
        typeof schema !== "object" ||
        schema === null ||
        "type" in schema === false ||
        schema.type !== "object" ||
        "title" in schema === false ||
        "properties" in schema === false ||
        typeof schema.properties !== "object" ||
        schema.properties === null
    ) {
        throw new Error(`Invalid JSON schema in file: ${filePath}`);
    }
    return schema as JSONSchema;
}
