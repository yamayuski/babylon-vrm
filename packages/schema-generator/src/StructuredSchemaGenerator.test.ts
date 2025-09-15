import type { JSONSchema } from "json-schema-to-typescript/dist/src/types/JSONSchema";
import { describe, expect, it } from "vitest";
import { StructuredSchemaGenerator } from "./StructuredSchemaGenerator";

describe("SchemaGenerator", () => {
    it("should generate structured schema for simple object", () => {
        const schema = {
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
                tags: { type: "array", items: { type: "string" } },
            },
            required: ["name"],
        } as JSONSchema;

        const gen = new StructuredSchemaGenerator();
        const out = gen.generate(schema);

        expect(out.type).toBe("object");
        expect(out.properties).toBeDefined();
        expect(out.properties?.name.type).toBe("string");
        expect(out.properties?.age.type).toBe("number");
        expect(out.properties?.tags.type).toBe("array");
        expect(out.properties?.tags.items).toStrictEqual({
            type: "string",
            metadata: {},
            title: undefined,
            tsType: undefined,
        });
        expect(out.required).toEqual(["name"]);
    });

    it("should resolve local $ref", () => {
        const schema = {
            definitions: {
                Person: {
                    type: "object",
                    properties: { name: { type: "string" } },
                },
            },
            $ref: "#/definitions/Person",
        } as JSONSchema;

        const gen = new StructuredSchemaGenerator();
        const out = gen.generate(schema);
        expect(out.type).toBe("object");
        expect(out.properties?.name.type).toBe("string");
        expect(out.ref).toBeUndefined();
    });

    it("should handle circular refs", () => {
        const schema = {
            definitions: {
                Node: {
                    type: "object",
                    properties: {
                        next: { $ref: "#/definitions/Node" },
                    },
                },
            },
            $ref: "#/definitions/Node",
        } as JSONSchema;

        const gen = new StructuredSchemaGenerator();
        const out = gen.generate(schema);
        expect(out.type).toBe("object");
        expect(out.properties?.next.ref).toBe("#/definitions/Node");
    });
});
