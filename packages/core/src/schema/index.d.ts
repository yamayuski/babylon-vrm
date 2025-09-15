/**
 * glTF Property
 * @link https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/schema/glTFProperty.schema.json
 */
export interface IGLTFProperty {
    /**
     * JSON object with extension-specific objects.
     * @link https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/schema/extension.schema.json
     */
    extensions?: {
        [key: string]: unknown;
    };
    /**
     * Application-specific data.
     * Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability.
     */
    extras?: unknown;
}

export interface IGLTFChildOfRootProperty extends IGLTFProperty {
    /**
     * The user-defined name of this object.
     * This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name.
     */
    name?: string;
}

/**
 * @link https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/schema/textureInfo.schema.json
 */
export interface ITextureInfo extends IGLTFProperty {
    /**
     * The index of the texture
     */
    index: number;
    /**
     * The set index of texture's TEXCOORD attribute used for texture coordinate mapping
     */
    texCoord?: number;
}

/**
 * @link https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/schema/glTFid.schema.json
 * glTF Id
 * @minimum 0
 */
export type IGLTFId = number;
