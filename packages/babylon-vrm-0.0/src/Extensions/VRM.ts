/**
 * @license MIT
 */

import { GLTFLoader, IGLTFLoaderExtension } from "@babylonjs/loaders/glTF/2.0";

export type VRMOptions = {};

declare module "@babylonjs/loaders" {
    export interface GLTFLoaderExtensionOptions {
        vrm: VRMOptions;
    }
}

export const NAME = "VRM" as const;

export class VRM implements IGLTFLoaderExtension {
    public readonly name = NAME;
    public enabled = true;

    public constructor(loader: GLTFLoader) {
        const options = loader.parent.extensionOptions[NAME];
    }

    public dispose(): void {
        // nop
    }
}
