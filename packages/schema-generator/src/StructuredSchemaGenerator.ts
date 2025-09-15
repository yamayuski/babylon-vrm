import type { JSONSchema } from "json-schema-to-typescript/dist/src/types/JSONSchema";

export type StructuredSchema = {
    type?: string | string[];
    tsType?: string;
    title?: string;
    properties?: Record<string, StructuredSchema>;
    items?: StructuredSchema | StructuredSchema[];
    required?: string[];
    ref?: string;
    metadata?: Record<string, unknown>;
    additionalProperties?: StructuredSchema | boolean;
};

export class StructuredSchemaGenerator {
    private rootSchema?: JSONSchema;
    private visited: Map<string, StructuredSchema> = new Map();

    generate(schema: JSONSchema): StructuredSchema {
        this.rootSchema = schema;
        this.visited = new Map();
        return this.visit(schema, "#");
    }

    private visit(schema: JSONSchema | boolean, path: string): StructuredSchema {
        if (schema === true) return { type: "unknown" };
        if (schema === false) return { type: "never" };

        // Avoid processing same path twice (handle cycles)
        if (this.visited.has(path)) {
            return { ref: path };
        }

        const node: StructuredSchema = {};
        this.visited.set(path, node);

        if (schema.allOf && Array.isArray(schema.allOf) && schema.allOf.length > 0 && schema.allOf[0].$ref) {
            this.visitRef(schema.allOf[0].$ref, node, path);
        }

        if (schema.$ref) {
            return this.visitRef(schema.$ref, node, path);
        }

        node.tsType = schema.tsType;
        node.title = schema.title;

        node.metadata = [
            { key: "description", value: schema.description },
            { key: "default", value: schema.default },
            { key: "deprecated", value: schema.deprecated },
            { key: "multipleOf", value: schema.multipleOf },
            { key: "maximum", value: schema.maximum },
            { key: "exclusiveMaximum", value: schema.exclusiveMaximum },
            { key: "minimum", value: schema.minimum },
            { key: "exclusiveMinimum", value: schema.exclusiveMinimum },
            { key: "maxLength", value: schema.maxLength },
            { key: "minLength", value: schema.minLength },
            { key: "pattern", value: schema.pattern },
            { key: "additionalItems", value: schema.additionalItems },
            { key: "maxItems", value: schema.maxItems },
            { key: "minItems", value: schema.minItems },
            { key: "uniqueItems", value: schema.uniqueItems },
            { key: "maxProperties", value: schema.maxProperties },
            { key: "minProperties", value: schema.minProperties },
            { key: "additionalProperties", value: schema.additionalProperties },
            { key: "enum", value: schema.enum },
            { key: "format", value: schema.format },
            { key: "const", value: schema.const },
        ].reduce(
            (acc, { key, value }) => {
                if (value !== undefined) acc[key] = value;
                return acc;
            },
            {} as Record<string, unknown>,
        );

        const t = schema.type;
        if (t === "object" || (Array.isArray(t) && t.includes("object")) || schema.properties) {
            node.type = "object";
            node.properties = {};
            const required = Array.isArray(schema.required) ? schema.required : [];
            if (required.length) node.required = required.slice();

            const props = schema.properties || {};
            for (const [key, propSchema] of Object.entries(props)) {
                const childPath = `${path}/properties/${encodeURIComponent(key)}`;
                node.properties[key] = this.visit(propSchema as JSONSchema, childPath);
            }

            // handle additionalProperties as schema
            if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
                node.additionalProperties = this.visit(
                    schema.additionalProperties as JSONSchema,
                    `${path}/additionalProperties`,
                );
            } else if (schema.additionalProperties === true) {
                node.additionalProperties = { type: "unknown" };
            } else if (schema.additionalProperties === false) {
                node.additionalProperties = { type: "never" };
            }

            return node;
        }

        if (t === "array" || (Array.isArray(t) && t.includes("array")) || schema.items) {
            node.type = "array";
            if (Array.isArray(schema.items)) {
                node.items = (schema.items as JSONSchema[]).map((it, i) => this.visit(it, `${path}/items/${i}`));
            } else if (schema.items) {
                node.items = this.visit(schema.items as JSONSchema, `${path}/items`);
            } else {
                node.items = { type: "unknown" };
            }
            return node;
        }

        // primitive types
        if (t) {
            node.type = t as string;
            return node;
        }

        return node;
    }

    private visitRef(ref: string, placeholder: StructuredSchema, _currentPath: string): StructuredSchema {
        // Record ref to avoid infinite loops
        placeholder.ref = ref;

        // Only support local references starting with '#'
        if (!ref.startsWith("#")) {
            return { ref };
        }

        const target = this.resolveLocalRef(ref);
        if (!target) return { ref };

        // If we've already resolved this ref to a structured node, return a pointer
        const canonicalPath = this.refToPath(ref);
        if (this.visited.has(canonicalPath)) {
            return { ref: canonicalPath };
        }

        // Visit target
        const result = this.visit(target, canonicalPath);
        // Update visited mapping to point to actual result
        this.visited.set(canonicalPath, result);
        return result;
    }

    private refToPath(ref: string): string {
        // convert '#/definitions/Foo' -> '#/definitions/Foo'
        return ref;
    }

    private resolveLocalRef(ref: string): JSONSchema | undefined {
        if (!this.rootSchema) return undefined;
        // Strip leading '#'
        const withoutHash = ref.replace(/^#/, "");
        if (!withoutHash) return this.rootSchema;
        const parts = withoutHash
            .split("/")
            .filter(Boolean)
            .map((p) => decodeURIComponent(p));
        let node: unknown = this.rootSchema as unknown;
        for (const part of parts) {
            if (node && typeof node === "object" && part in node) {
                node = (node as { [part]: unknown })[part];
            } else {
                return undefined;
            }
        }
        return node as JSONSchema;
    }
}
