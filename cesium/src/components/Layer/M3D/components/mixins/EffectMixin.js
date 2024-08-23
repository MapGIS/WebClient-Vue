export default {
  data() {
    return {};
  },
  methods: {
    /**
     * 根据layerIndex获取MapGISM3DSet对象
     * @return {Cesium.MapGISM3DSet} tileset对象
     * */
    getM3DSet() {
      const { layerIndex, viewer, m3ds } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      return tileset;
    },
    /**
     * 将数字转为浮点数格式的字符串
     * @param {Number} number 数字
     * @return {String} 浮点数格式的字符串，例如'1.0'
     * */
    formatNumberToString(number) {
      const numberCopy = Number(number)
      if (Number.isInteger(numberCopy)) {
        return String(numberCopy) + '.0';
      }
      return String(numberCopy)
    },
    /**
     * 如果MapGISM3DSet对象上有style属性，则备份其内容
     * @param {Cesium.MapGISM3DSet} tileset MapGISM3DSet对象
     * */
    setHighLightBack(tileset) {
      if (tileset.style) {
        const { color } = tileset.style
        this.highLightBack = color.expression
      }
    },
    /**
     * 移除呼吸灯特效
     * */
    removeEffect() {
      const { Cesium } = this
      // 1 获取MapGISM3DSet对象
      let tileset = this.getM3DSet();
      if (!tileset) return;

      // 2 移除呼吸灯特效
      tileset.customShader = undefined

      // 3 还原MapGISM3DSet对象上原本的style
      if (this.highLightBack) {
        tileset.style = new Cesium.Cesium3DTileStyle({
          color: this.highLightBack
        });
      }
    },
    unmount() {
      // this.removeEffect();
      this.$emit("unload", { component: this });
    },
  }
};
