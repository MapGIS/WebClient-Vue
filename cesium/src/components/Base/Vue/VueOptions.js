export default {
  /**
   * @type String
   * @description 该key的主要作用是用来记录Cesium的WebGlobal的
   * 内存中的引用数组的引用，从而避免vue对cesium的内存劫持
   */
  vueKey: { typs: String, default: "default" },
  /**
   * @type String
   * @description 该key的主要作用是用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的下标，从而避免vue对cesium的内存劫持
   */
  vueIndex: {
    typs: [String, Number],
    default: () => (Math.random() * 100000000).toFixed(0)
  }
};
