<script>
export default {
  name: "mapgis-3d-graphic-layer-service",
  inject: ["Cesium", "viewer"],
  methods: {
    /**
     * 通过vueIndex, vueKey，初始化一个graphicsLayer对象，请示用$_getGraphicLayer方法获取GraphicLayer对象，不要将此对象绑定在vue上
     * @param vueIndex String or Number 必传，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @param viewer Object 可选，Cesium的Viewer对象，不传则使用注入的Viewer对象
     *  @return GraphicLayer Object 一个GraphicLayer对象
     * */
    $_initGraphicLayer(vueIndex, vueKey, viewer) {
      viewer = viewer || this.viewer;
      vueKey = vueKey || "default";
      if (!Cesium.hasOwnProperty("GraphicsLayer")) {
        console.warn("请升级最新版的Cesium库！");
        return;
      }
      let graphicsLayer = new Cesium.GraphicsLayer(viewer, {});
      viewer.scene.layers.appendGraphicsLayer(graphicsLayer);
      window.vueCesium.GraphicsLayerManager.addSource(vueKey, vueIndex, graphicsLayer);
      return graphicsLayer;
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
    },
    /**
     * 将类型从英文转为中文
     * @param type String 类型，英文
     * @return type String 类型，中文
     * */
    $_formatType(type) {
      let format = {
        label: "文字",
        marker: "标签",
        point: "点",
        line: "直线",
        curve: "曲线",
        polygon: "多边形",
        rectangle: "矩形",
        circle: "圆",
        cube: "正方体",
        polygonCube: "立体多边形",
        cuboid: "长方体",
        cylinder: "圆柱",
        cone: "圆锥",
        ellipsoid: "球",
        model: "模型",
      }

      return format[type];
    },
    /**
     * 获取UUID
     * @param random Number 随机数银子
     * @return id Number uuid
     * */
    $_getUUID(random) {
      random = random || 10000000000;
      return parseInt(String(Math.random() * random));
    },
  }
}
</script>

<style scoped>

</style>