<script>
import {saveAs} from "file-saver";

export default {
  name: "mapgis-3d-graphic-layer-service",
  inject: ["Cesium", "viewer"],
  data() {
    return {
      localVueIndex: undefined,
      localVueKey: undefined
    }
  },
  methods: {
    hasObject(obj, callBack, warn) {
      warn = warn || "graphicsLayer不存在！";
      if (!obj) {
        console.warn(warn);
        return;
      }
      return callBack(obj);
    },
    /**
     * 初始化一个graphicsLayer对象，请通过$_getGraphicLayer方法获取GraphicLayer对象，不要将GraphicLayer对象绑定在vue上
     * @param options Object 初始化参数 可选
     * {
     *   vueIndex: vueIndex,//String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串，不传则自动生成
     *   vueKey: vueIndex,//String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     *   viewer: viewer,//Object 可选，Cesium的Viewer对象，不传则使用注入的Viewer对象
     *   getGraphic: getGraphic(e),//Function 可选，绘制完成后的回调事件，返回绘制完成的对象
     * }
     * */
    $_newGraphicLayer(options) {
      options = options || {};
      let {vueIndex, vueKey, viewer, getGraphic} = options;
      viewer = viewer || this.viewer;
      vueIndex = vueIndex || this.$_getId();
      vueKey = vueKey || "default";
      this.localVueIndex = vueIndex;
      this.localVueKey = vueKey;
      if (!Cesium.hasOwnProperty("GraphicsLayer")) {
        console.warn("请升级最新版的Cesium库！");
        return;
      }
      let graphicsLayer = new Cesium.GraphicsLayer(viewer, {
        getGraphic: getGraphic
      });
      viewer.scene.layers.appendGraphicsLayer(graphicsLayer);
      window.vueCesium.GraphicsLayerManager.addSource(vueKey, vueIndex, graphicsLayer);
    },
    /**
     * 通过vueKey，vueIndex来获取graphicsLayer对象，默认不用传vueKey，vueIndex
     * @param vueIndex String or Number 必传，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return graphicsLayer Object graphicsLayer对象
     * */
    $_getGraphicLayer(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let GraphicsLayerManager = window.vueCesium.GraphicsLayerManager.findSource(vueKey, vueIndex);
      return this.hasObject(GraphicsLayerManager, function (GraphicsLayerManager) {
        return GraphicsLayerManager.source;
      }, "请初始化GraphicsLayer对象");
    },
    /**
     * 通过vueKey，vueIndex来切换graphicsLayerService默认对应的graphicsLayer对象
     * @param vueIndex String or Number 必传，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 必传，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_switchGraphicLayer(vueIndex, vueKey) {
      this.localVueIndex = vueIndex;
      this.localVueKey = vueKey;
    },
    /**
     * 通过绘制参数options来绘制要素，可通过vueIndex，vueKey来指定要绘制在哪一个graphicsLayer图层上
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
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_startDrawing(options, vueIndex, vueKey) {
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      options = options || {};
      if (!options.hasOwnProperty("type")) {
        console.warn("请输入绘制类型！");
      }
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.startDrawing(options);
      });
    },
    /**
     * 停止绘制标绘图形对象
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_stopDrawing(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.stopDrawing();
      });
    },
    /**
     * 开始编辑标绘图形对象
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_startEdit(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.startEdit();
      });
    },
    /**
     * 停止编辑标绘图形对象
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_stopEdit(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.stopEdit();
      });
    },
    /**
     * 更新标绘图形对象样式
     * @param primitive Object 必传，标绘图形对象
     * @param key String 必传，样式名
     * @param value Any 必传，样式值
     * */
    $_updateStyle(primitive, key, value) {
      primitive.style[key] = value;
    },
    /**
     * 通过style对象，更新标绘图形对象样式，一次可同时更新多个值
     * @param id String 必传，标绘图形对象ID
     * @param style Object 必传，样式对象
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_updateStyleByStyle(id, style, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      let vm = this;
      if (!style || !(style instanceof Object)) {
        console.warn("样式为空或者不是对象！");
        return;
      }
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        let primitive = graphicsLayer.getGraphicByID(id);
        vm.hasObject(primitive, function (primitive) {
          Object.keys(style).forEach(function (key) {
            primitive.style[key] = style[key];
          });
        }, "标绘对象不存在");
      });
    },
    /**
     * 通过一个标绘图层对象，更新标绘图形对象样式，一次可同时更新多个标绘对象的多个值
     * @param layer Object 必传，标绘图层对象
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_updateStyleByLayer(layer, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      const {dataSource} = layer;
      if (!dataSource || !(dataSource instanceof Array)) {
        console.warn("dataSource为空或者不是数组！");
        return;
      }
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        for (let i = 0; i < dataSource.length; i++) {
          let primitive = graphicsLayer.getGraphicByID(dataSource[i].id);
          if (primitive) {
            if (dataSource[i].style && dataSource[i].style instanceof Object) {
              Object.keys(dataSource[i].style).forEach(function (key) {
                primitive.style[key] = dataSource[i].style[key];
              });
            }
          }
        }
      });
    },
    /**
     * 通过ID更新标绘图形对象样式
     * @param id String 必传，标绘图形对象ID
     * @param key String 必传，样式名
     * @param value Any 必传，样式值
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_updateStyleById(id, key, value, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer();
      let vm = this;
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        let primitive = graphicsLayer.getGraphicByID(id);
        vm.hasObject(primitive, function (primitive) {
          primitive.style[key] = value;
        }, "标绘对象不存在");
      });
    },
    /**
     * 根据id获取标绘图形对象
     * @param id String 标绘图形对象的id
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return primitive Object 标绘图形对象
     * */
    $_getGraphicByID(id, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      return this.hasObject(graphicsLayer, function (graphicsLayer) {
        return graphicsLayer.getGraphicByID(id);
      });
    },
    /**
     * 根据index获取标绘图形对象
     * @param index Number 标绘图形对象的index
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return primitive Object 标绘图形对象
     * */
    $_getGraphicByIndex(index, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      return this.hasObject(graphicsLayer, function (graphicsLayer) {
        return graphicsLayer.getGraphicByIndex(index);
      });
    },
    /**
     * 加载json数据
     * @param json Object or String 标绘元素生成的json对象
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * */
    $_fromJson(json, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      if (json instanceof Array) {
        json = JSON.stringify(json);
      } else if (json instanceof Object) {
        json = JSON.stringify([json]);
      }
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.loadJson(json);
      });
    },
    /**
     * 通过id来获取标绘对象的json数据
     * @param id String 标绘对象的ID
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return json Object 标绘对象的json数据
     * */
    $_getJsonById(id, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let jsons = this.$_toJSON(vueIndex, vueKey);
      let json;
      for (let i = 0; i < jsons.length; i++) {
        if (jsons[i].id === id) {
          json = jsons[i];
          break;
        }
      }
      return json;
    },
    /**
     * 将整个图层导出为数据
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return json Object 标绘图层的JSON对象
     * */
    $_toJSON(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      return this.hasObject(graphicsLayer, function (graphicsLayer) {
        return JSON.parse(graphicsLayer.exportToJson());
      });
    },
    /**
     * 将数据导出为文件
     * @param dataSource Any 必传，要导出为文件的数据
     * @param title String 可选，文件名，不传时为无标题
     * */
    $_toFile(dataSource, title) {
      title = title || "无标题";
      this.hasObject(dataSource, function (dataSource) {
        const blob = new Blob([JSON.stringify(dataSource)], {
          type: "application/json;charset=utf-8",
        });
        saveAs(blob, title + ".json");
      }, "请传入数据");
    },
    /**
     * 移除图层所有标绘图形
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return isRemove Boolean 是否移除成功
     * */
    $_removeAllGraphic(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.removeAllGraphic();
      });
    },
    /**
     * 移除选中标绘图形
     * */
    $_removePickingGraphic() {
      let graphicsLayer = this.$_getGraphicLayer();
      return graphicsLayer.removePickingGraphic();
    },
    /**
     * 根据index移除选中标绘图形
     * @param index Number 要移除的标绘图形的index
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return isRemove Boolean 是否移除成功
     * */
    $_removeGraphicByIndex(index, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.removeGraphicByIndex(index);
      });
    },
    /**
     * 根据id移除选中标绘图形
     * @param id String 要移除的标绘图形的id
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return isRemove Boolean 是否移除成功
     * */
    $_removeGraphicByID(id, vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.removeGraphicByID(id);
      });
    },
    /**
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * 销毁整个图层
     * */
    $_destroy(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.hasObject(graphicsLayer, function (graphicsLayer) {
        graphicsLayer.destroy();
      });
    },
    /**
     * 获取图层所有标绘图形
     * @param vueIndex String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串
     * @param vueKey String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
     * @return [Primitive] Array 返回所有图形对象
     * */
    $_getAllGraphic(vueIndex, vueKey) {
      vueIndex = vueIndex || this.localVueIndex;
      vueKey = vueKey || this.localVueKey;
      let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      return this.hasObject(graphicsLayer, function (graphicsLayer) {
        return graphicsLayer.getAllGraphic();
      });
    },
    /**
     * 将类型从英文转为中文
     * @param type String 类型，英文
     * @return type String 类型，中文
     * */
    $_formatType(type) {
      let format = {
        label: "文字",
        billboard: "广告牌",
        point: "点",
        line: "直线",
        curve: "曲线",
        polygon: "多边形",
        rectangle: "矩形",
        circle: "圆",
        cube: "正方体",
        polygonCube: "立体多边形",
        cuboid: "长方体",
        cone: "圆柱",
        cylinder: "圆锥",
        ellipsoid: "球",
        polylineVolume: "圆管线",
        corridor: "方管线",
        model: "模型",
      }

      return format[type];
    },
    /**
     * 获取随机数字id
     * @param random Number 随机数因子
     * @return id Number id
     * */
    $_getId(random) {
      random = random || 10000000000;
      return parseInt(String(Math.random() * random));
    },
    $_cartesian3ToLongLat(cartesian3) {
      let position = {};
      let graphicPosition = Cesium.Cartographic.fromCartesian(cartesian3);
      position.lat = Cesium.Math.toDegrees(graphicPosition.latitude);
      position.lng = Cesium.Math.toDegrees(graphicPosition.longitude);
      position.alt = graphicPosition.height;
      return position;
    },
  }
}
</script>

<style scoped>

</style>