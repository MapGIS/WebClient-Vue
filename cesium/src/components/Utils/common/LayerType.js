/**
 * 描述图层类型
 * @type {{TERRAINLAYER: Number, MODELLAYER: Number, TILEIMAGELAYER: Number, UNKNOWN: Number, VECTORLAYER: Number, M3DLAYER: Number}}
 */
export const LayerType = {
    /**
     * 未知类型.
     *
     * @type {Number}
     * @constant
     */
    UNKNOWN: 0,

    /**
     * 简单要素类矢量层.
     *
     * @type {Number}
     * @constant
     */
    VECTORLAYER: 1,

    /**
     * 简单要素类模型层.
     *
     * @type {Number}
     * @constant
     */
    MODELLAYER: 2,

    /**
     * 地形层.
     *
     * @type {Number}
     * @constant
     */
    TERRAINLAYER: 3,

    /**
     * 瓦片层.
     *
     * @type {Number}
     * @constant
     */
    TILEIMAGELAYER: 8,

    /**
     * m3d模型层.
     *
     * @type {Number}
     * @constant
     */
    M3DLAYER: 10
}