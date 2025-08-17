/**
 * @license MIT
 */

import {
    type ISceneLoaderPluginFactory,
    RegisterSceneLoaderPlugin,
    type SceneLoaderPluginOptions,
} from "@babylonjs/core/Loading/sceneLoader";
import { registerGLTFExtension } from "@babylonjs/loaders/glTF/2.0";
import { VRMFileLoaderMetadata } from "./VRMFileLoader.metadata";

/**
 * Registers the VRM file loader as glTFFileLoader.
 */
export function registerLoaders(): void {
    // This makes sure that the VRM file loader is registered as a glTF file loader.
    RegisterSceneLoaderPlugin({
        ...VRMFileLoaderMetadata,
        createPlugin: async (options: SceneLoaderPluginOptions) => {
            const { GLTFFileLoader } = await import("@babylonjs/loaders/glTF/glTFFileLoader");
            return new GLTFFileLoader(options[VRMFileLoaderMetadata.name]);
        },
    } satisfies ISceneLoaderPluginFactory);

    // Register the VRM 0.x extension for glTF.
    registerGLTFExtension("VRM", true, async (loader) => {
        const { VRM } = await import("./Extensions/VRM");
        return new VRM(loader);
    });
}
