import type { GLTFLoader } from "@babylonjs/loaders/glTF/2.0";
import { test } from "vitest";
import { NAME, VRM } from "./VRM";

test("VRM extension should have the correct name", ({ expect }) => {
    expect(NAME).toBe("VRM");
});

test("VRM constructor should initialize correctly", ({ expect }) => {
    const loader = {
        parent: {
            extensionOptions: {
                vrm: {},
            },
        },
    } as unknown as GLTFLoader;
    const vrm = new VRM(loader);
    expect(vrm).toBeInstanceOf(VRM);
});
