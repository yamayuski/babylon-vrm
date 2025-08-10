/**
 * @license MIT
 */

import { registerGLTFExtension } from "@babylonjs/loaders/glTF/2.0";
import { VRMFileLoaderMetadata } from "./VRMFileLoader.metadata";
import {
    ISceneLoaderPluginFactory,
    RegisterSceneLoaderPlugin,
    SceneLoaderPluginOptions,
} from "@babylonjs/core/Loading/sceneLoader";

/**
 * Registers the VRM file loader as glTFFileLoader.
 */
export function registerLoaders(): void {
    RegisterSceneLoaderPlugin({
        ...VRMFileLoaderMetadata,
        createPlugin: async (options: SceneLoaderPluginOptions) => {
            const { GLTFFileLoader } = await import("@babylonjs/loaders/glTF/glTFFileLoader");
            return new GLTFFileLoader(options[VRMFileLoaderMetadata.name]);
        },
    } satisfies ISceneLoaderPluginFactory);

    registerGLTFExtension("VRM", true, async (loader) => {
        const { VRM } = await import("./Extensions/VRM");
        return new VRM(loader);
    });
}
