<script>
export default {
  name: "mapgis-3d-graphic-layer-service",
  inject: ["Cesium", "viewer"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },
  methods: {
    //初始化graphicsLayer对象
    $_initGraphicLayer() {
      if (!Cesium.hasOwnProperty("GraphicsLayer")) {
        console.warn("请升级最新版的Cesium库！");
        return;
      }
      let graphicsLayer = new Cesium.GraphicsLayer(this.viewer, {});
      this.viewer.scene.layers.appendGraphicsLayer(graphicsLayer);
      window.vueCesium.GraphicsLayerManager.addSource(this.vueKey, this.vueIndex, graphicsLayer);
    },
    /**
     * 通过vueKey，vueIndex来获取graphicsLayer对象，默认不用传vueKey，vueIndex
     * @param vueKey String
     * @param vueIndex Number
     * @return graphicsLayer Object graphicsLayer对象
     * */
    $_getGraphicLayer(vueKey, vueIndex) {
      vueKey = vueKey || this.vueKey;
      vueIndex = vueIndex || this.vueIndex;
      let GraphicsLayerManager = window.vueCesium.GraphicsLayerManager.findSource(vueKey, vueIndex);
      if (!GraphicsLayerManager) {
        console.warn("请初始化GraphicsLayer对象");
        return;
      }
      return GraphicsLayerManager.source;
    },
    /**
     * 通过vueKey，vueIndex来获取graphicsLayer对象，默认不用传vueKey，vueIndex
     * @param options Object 绘制参数，有如下值
     *  type: 类型，必选,
     *  id: 要素ID，可选,
     *  positions: 绘制要素的点坐标，可选,
     *  style: 绘制样式，可选,
     *  editPointStyle: this._editPointStyle,
     *  attributes: 绘制要素的属性,
     *  name: 名字,
     *  show: 是否显示要素,
     *  editing: 是否可编辑要素,
     *  allowPicking: 是否可选中,
     *  modelMatrix: 矩阵,
     *  asynchronous:
     *  getPrimitive: 绘制完成后的回调事件，返回绘制好的对象
     * */
    $_startDrawing(options) {
      let graphicsLayer = this.$_getGraphicLayer();
      options = options || {};
      if (!options.hasOwnProperty("type")) {
        console.warn("请输入绘制类型！");
      }
      graphicsLayer.startDrawing(options);
    },
    /**
     * 停止绘制标绘图形对象
     * */
    $_stopDrawing() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.stopDrawing();
    },
    /**
     * 开始编辑标绘图形对象
     * */
    $_startEdit() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.startEdit();
    },
    /**
     * 停止编辑标绘图形对象
     * */
    $_stopEdit() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.stopEdit();
    },
    /**
     * 根据id获取标绘图形对象
     * @param id String 标绘图形对象的id
     * @return primitive Object 标绘图形对象
     * */
    $_getPlottingPrimtiveByID(id) {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.getPlottingPrimtiveByID(id);
    },
    /**
     * 根据index获取标绘图形对象
     * @param index Number 标绘图形对象的index
     * @return primitive Object 标绘图形对象
     * */
    $_getPlottingPrimtiveByIndex(index) {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.getPlottingPrimtiveByIndex(index);
    },
    /**
     * 加载json文件
     * @param json Object 标绘元素生成的json对象
     * */
    $_loadJson(json) {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.loadJson(json);
    },
    /**
     * 将整个图层导出为json文件
     * return json Object 标绘图层的JSON对象
     * */
    $_exportToJson() {
      let graphicsLayer = this.$_getGraphicLayer();
      return JSON.parse(graphicsLayer.exportToJson());
    },
    /**
     * 移除图层所有标绘图形
     * @return isRemove Boolean 是否移除成功
     * */
    $_removeAllPirmive() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.removeAllPirmive();
    },
    /**
     * 移除选中标绘图形
     * */
    $_removePickingPrimive() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.removePickingPrimive();
    },
    /**
     * 根据index移除选中标绘图形
     * @param index Number 要移除的标绘图形的index
     * */
    $_removePlottingPrimitiveByIndex(index) {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.removePickingPrimive(index);
    },
    /**
     * 根据id移除选中标绘图形
     * @param id String 要移除的标绘图形的id
     * */
    $_removePlottingPrimiveByID(id) {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.removePlottingPrimiveByID(id);
    },
    /**
     * 移除整个图层
     * */
    $_destroy() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.destroy();
    },
    /**
     * 获取图层所有标绘图形
     * @return [Primitive] Array 返回所有图形对象
     * */
    $_getAllPlottingPrimitive() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.getAllPlottingPrimitive();
    }
  }
}
</script>

<style scoped>

</style>