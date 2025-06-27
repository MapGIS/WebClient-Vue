<script>
import {
  Extent,
  TileInfo,
  SpatialReference,
  Point,
  IGSVectorTileLayer,
} from "@mapgis/webclient-common";
import {
  getTilingScheme,
  CustomTilingScheme,
  MapGISVectorTileImageryProvider,
  getProviderExtent,
  VectorTileLayerUtil,
} from "@mapgis/webclient-cesium-plugin";
import VectorTileOptions from "./VectorTileOptions";
import ServiceLayer from "../ServiceLayer";
import clonedeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import { Util } from "@mapgis/webclient-vue-ui";
const { UrlUtil } = Util

export default {
  name: "mapgis-3d-vectortile-layer",
  mixins: [ServiceLayer],
  props: { ...VectorTileOptions },
  data() {
    return {
      managerName: "VectorTileManager",
    };
  },
  created() {},
  mounted() {
    this.$_mount().then(() => {
      this.watchProp();
    });
  },
  destroyed() {
    this.$_unmount();
  },
  watch: {
    layerStyle: {
      handler: function (next, old) {
        let { vueKey, vueIndex, vueCesium } = this;
        let layer = vueCesium[this.managerName].findSource(vueKey, vueIndex);
        if (!layer) {
          return;
        }
        if (this.layerStyleCopy.visible !== this.layerStyle.visible) {
          layer.source.show = this.layerStyle.visible;
        }
        if (this.layerStyleCopy.opacity !== this.layerStyle.opacity) {
          layer.source.alpha = this.layerStyle.opacity;
        }
        if (this.layerStyleCopy.zIndex !== this.layerStyle.zIndex) {
          this.$_moveLayer();
        }
        this.layerStyleCopy = clonedeep(next);
      },
      deep: true,
    },
  },
  methods: {
    async createCesiumObject() {
      const { $props, viewer, vueCesium } = this;
      const { tilingScheme } = $props;
      let tileScheme = undefined;

      // 获取tilingScheme对象
      if (tilingScheme) {
        if (typeof tilingScheme === "string") {
          tileScheme = this.checkTiling(tilingScheme);
        } else {
          tileScheme = tilingScheme;
        }
      } else if ($props.tileInfo && $props.spatialReference && $props.extent) {
        // 传入tileInfo、spatialReference、extent，获取自定义的tilingScheme对象
        tileScheme = this.getCustomTilingScheme(
          $props.tileInfo,
          $props.spatialReference,
          $props.extent
        );
      } else {
        // 没有传tilingScheme和tileInfo、spatialReference、extent，给定默认4326地理坐标系
        tileScheme = new Cesium.GeographicTilingScheme();
      }

      return new Promise(
        async (resolve) => {
          let vectortile;

          // 获取图层tileInfo上的最大最小层级，与传入的最大最小层级区交集
          const limitLevels = this.$_getLevelRangeByTileInfo($props.tileInfo);
          let minimumLevel = 0;
          let maximumLevel = 22;
          if ($props.options) {
            const optMinimumLevel = $props.options.minimumLevel || 0;
            const optMaximumLevel = $props.options.maximumLevel || 22;
            minimumLevel = Math.max(optMinimumLevel, limitLevels[0]);
            maximumLevel = Math.min(optMaximumLevel, limitLevels[1]);
          }

          const opt = {
            ...$props,
            minimumLevel,
            maximumLevel,
            tilingScheme: tileScheme,
          };

          // 获取provider图层范围
          const extent = getProviderExtent(opt, opt.tilingScheme.rectangle);
          // 矢量瓦片动态注记wgs84Extent需要将extent的空间参考系强制设置为EPSG:4326
          extent.spatialReference = new SpatialReference("EPSG:4326");
          opt.rectangle = new Cesium.Rectangle(
            extent.xmin,
            extent.ymin,
            extent.xmax,
            extent.ymax
          );

          // 获取矢量瓦片图层样式对象
          opt.style = await this.getMVTStyleObject();

          opt.scene = viewer.scene;
          opt.tileWidth =
            opt.tileInfo && opt.tileInfo.size ? opt.tileInfo.size[0] : 256;
          opt.tileHeight =
            opt.tileInfo && opt.tileInfo.size ? opt.tileInfo.size[1] : 256;
          // 添加矢量图层
          vectortile = this.$_addLayer(opt);
          resolve(vectortile);
        },
        (reject) => {}
      );
    },
    // 添加图层
    $_addLayer(opt) {
      // 初始化构建MapGISVectorTileImageryProvider对象
      const vectorTileProvider = new MapGISVectorTileImageryProvider({
        style: opt.style,
        opacity: opt.opacity ? opt.opacity : 1,
        // 初始化是否可见
        show: opt.visible ? opt.visible : true,
        tilingScheme: opt.tilingScheme,
        scene: opt.scene,
        labelsRenderMode: opt.labelsRenderMode
          ? opt.labelsRenderMode
          : "off-screen",
        rectangle: opt.rectangle,
        tileWidth: opt.tileWidth,
        tileHeight: opt.tileHeight,
        transform: opt.mvtExtent
          ? [512 / opt.mvtExtent, 0, 0, 512 / opt.mvtExtent, 0, 0]
          : [0.125, 0, 0, 0.125, 0, 0],
        tokenKey: opt.tokenKey ? opt.tokenKey : "",
        tokenValue: opt.tokenValue ? opt.tokenValue : "",
        minimumLevel: opt.minimumLevel,
        maximumLevel: opt.maximumLevel,
      });
      // 添加图层到Cesium视图中
      return viewer.imageryLayers.addImageryProvider(vectorTileProvider);
    },
    // 移除图层
    $_removeLayer() {
      if (this.$vectortile) {
        this.viewer.imageryLayers.remove(this.$vectortile, true);
        this.$vectortile.show = false;
      }
    },
    // 根据tileInfo获取层级范围
    $_getLevelRangeByTileInfo(tileInfo) {
      const levels = [0, 22];
      if (
        !tileInfo ||
        !Array.isArray(tileInfo.lods) ||
        tileInfo.lods.length === 0
      ) {
        return levels;
      }
      const lods = tileInfo.lods;
      const firstLevel = lods[0].level;
      const lastLevel = lods[lods.length - 1].level;
      return [firstLevel, lastLevel];
    },
    // 获取适量瓦片样式对象
    getMVTStyleObject() {
      let styleUrl = undefined;
      let styleObject = undefined;
      let url = this.styleUrl;
      return new Promise((resolve, reject) => {
        if (this.mvtStyle) {
          if (typeof this.mvtStyle === "string") {
            //如果是个网络地址，就通过url请求获取矢量瓦片json对象
            styleUrl = this.mvtStyle;
          } else {
            styleObject = this.mvtStyle;
          }
        } else if (this.styleUrl) {
          // 样式json文件路径,有styleUrl就可以直接读取styleUrl里的信息;不然就是加载中地发布的矢量瓦片，使用ip，port和layerName先拼接styleUrl路径再进行查询。
          if (typeof this.styleUrl === "string") {
            styleUrl = this.styleUrl;
          } else {
            if (this.ip && this.layerName){
              const { ip, port } = this
              styleUrl = `${UrlUtil.getOrigin({ ip, port })}/igs/rest/mrcs/vtiles/0/${this.layerName}`;
            }
          }
        } else {
          if (!this.vectortilejson) {
            //如果没有矢量瓦片json对象，就通过url请求获取矢量瓦片json对象
            styleUrl = this.url;
          } else {
            styleObject = this.vectortilejson;
          }
        }
        if (!styleUrl && !styleObject) {
          resolve();
        } else {
          const igsVectorTileLayer = new IGSVectorTileLayer({
            url: styleUrl,
            style: styleObject,
          });
          igsVectorTileLayer.load().then((res) => {
            resolve(res.style);
          });
        }
      });
    },
    checkTiling(tileMatrixSetName) {
      let tilingScheme;
      if (
        tileMatrixSetName === "EPSG:4326" ||
        tileMatrixSetName === "EPSG:4490" ||
        tileMatrixSetName === "EPSG:4610" ||
        tileMatrixSetName === "EPSG:4214"
      ) {
        tilingScheme = new Cesium.GeographicTilingScheme();
      } else if (tileMatrixSetName === "EPSG:3857") {
        tilingScheme = new Cesium.WebMercatorTilingScheme();
      } else {
        tilingScheme = new Cesium.GeographicTilingScheme();
      }
      return tilingScheme;
    },
    // 根据tileInfo、spatialReference、extent，获取自定义TilingScheme对象
    getCustomTilingScheme(tileInfo, spatialReference, extent) {
      const spatialReferenceCommon = new SpatialReference({
        wkid: spatialReference.wkid,
      });
      const originCommon = new Point({
        coordinates: [tileInfo.origin.x, tileInfo.origin.y],
        spatialReference,
      });
      const extentCommon = new Extent({
        xmin: extent.xmin,
        ymin: extent.ymin,
        xmax: extent.xmax,
        ymax: extent.ymax,
      });
      const tileInfoCommon = new TileInfo({
        dpi: tileInfo.dpi,
        format: tileInfo.format,
        origin: originCommon,
        lods: tileInfo.lods,
        spatialReference: spatialReferenceCommon,
        size: tileInfo.size,
      });
      const tilingScheme = getTilingScheme(
        spatialReferenceCommon,
        extentCommon,
        tileInfoCommon
      );
      return tilingScheme;
    },
    watchProp() {
      const {
        vueCesium,
        viewer,
        vueKey,
        vueIndex,
        show,
        mvtStyle,
        vectortilejson,
      } = this;
      let find = vueCesium.VectorTileManager.findSource(vueKey, vueIndex);

      if (show) {
        this.$watch("show", function (next) {
          if (this.initial) return;
          if (find && !viewer.isDestroyed()) {
            find.source.show = next;
          }
        });
      }
      if (mvtStyle) {
        this.$watch("mvtStyle", {
          handler(nextStyle) {
            if (typeof nextStyle === "object" && !viewer.isDestroyed()) {
              this.updateStyle(nextStyle);
            }
          },
          deep: true,
        });
      }
      if (vectortilejson) {
        this.$watch("vectortilejson", {
          handler(nextStyle, oldStyle) {
            const isEqualStyle = isEqual(nextStyle, oldStyle);
            // 判断条件中增加比较新旧style值的逻辑。当nextStyle和oldStyle的对象属性值相同，不更新style。
            if (
              typeof nextStyle === "object" &&
              !isEqualStyle &&
              this.$vectortile !== undefined &&
              !viewer.isDestroyed()
            ) {
              this.updateStyle(nextStyle);
            }
          },
          deep: true,
        });
      }
    },
    updateStyle(style) {
      const options =
        this.$vectortile && this.$vectortile._imageryProvider
          ? this.$vectortile._imageryProvider.options
          : {};
      // 如果style对象属性值有改变，则更新图层（采用先删除在添加图层的方案）
      if (!isEqual(style, options.style)) {
        // this.layerStyle = style;
        // console.log("this.layerStyle: ", this.layerStyle);
        options.style = style;
        //this.$_removeLayer();
        this.$vectortile = this.$_addLayer(options);
      }
    },
    provider() {
      return this.$vectortile ? this.$vectortile._imageryProvider : undefined;
    },
    $_mount() {
      const { vueIndex, vueKey, vueCesium } = this;
      const { layerStyle } = this;
      const { visible, opacity, zIndex } = layerStyle;
      //取得webGlobe对象，防止当页面有多个webGlobe只会取得
      let viewer = this.$_getWebGlobe();
      const { imageryLayers } = viewer;

      if (viewer.isDestroyed()) return;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then((vectortile) => {
        vm.$vectortile = vectortile;
        let imageryLayer = vectortile;

        if (vueKey && vueIndex) {
          vueCesium.VectorTileManager.addSource(
            vueKey,
            vueIndex,
            imageryLayer,
            { vectortile }
          );
        }

        //初始化imageryLayers.addImageryProvider需要的index
        let providerZIndex;
        if (zIndex < 0) {
          throw new Error("zIndex不能为负数");
        } else if (!zIndex) {
          //如果没有设置layerStyle.zIndex，则layer的zIndex统一设置为0，并且按照初始化的顺序向上叠放
          providerZIndex = 0;
        } else {
          //确定zIndex不能重复
          vm.$_checkZIndex(imageryLayers);
          //如果有layerStyle.zIndex，则layer的zIndex为layerStyle.zIndex
          providerZIndex = zIndex;
        }

        //如果有zIndex，则保证zIndex大于0的layer始终在zIndex为0的layer上面，并按照zIndex从大到小排序
        //如果没有zIndex，则按初始化顺序向上叠放，如果在此layer的下方含有zIndex大于0的layer，则layer向下一层，直到下方没有包含zIndex大于0的layer
        //只会根据imageryLayers排序，不会影响其他图层
        vm.$_initLayerIndex();

        //设置图层是否可见
        if (typeof visible === "boolean") {
          imageryLayer.show = visible;
        }

        //设置涂层的透明度
        if (typeof opacity === "number") {
          imageryLayer.alpha = opacity;
        }

        //得到layerStyle的副本，供watch使用
        vm.layerStyleCopy = clonedeep(layerStyle);

        //设置图层id，分屏，卷帘使用
        if (vm.id.length === 0) {
          imageryLayer.id = vueIndex;
        } else {
          imageryLayer.id = this.id;
        }

        //保存layerId，方便找到zIndex
        vm.layerId = imageryLayer.id;

        let manageOptions = {
          zIndex: providerZIndex,
          id: imageryLayer.id,
        };

        //如果providerZIndex为0，表示初始化地图时，没有设置zIndex，因此会按照初始化的顺序向上叠放
        //如果之后给了zIndex，然后又删除了或者置空，则layer放最后一个包含zIndex的layer的下面，并按照zeroIndex排序
        if (providerZIndex === 0) {
          let maxZeroIndex = vm.$_getMaxZeroIndex();
          manageOptions.zeroIndex = maxZeroIndex + 1;
        }

        //将图层加入对应的manager
        vm.vueCesium[vm.managerName].addSource(
          vueKey,
          vueIndex,
          imageryLayer,
          manageOptions
        );

        //抛出load事件
        vm.$emit("load", imageryLayer, vm);
      });
      return promise;
    },
    $_unmount() {
      const { viewer, vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.VectorTileManager.findSource(vueKey, vueIndex);
      if (find && !viewer.isDestroyed()) {
        this.$_removeLayer();
        this.$vectortile = undefined;
      }
      vueCesium.VectorTileManager.deleteSource(vueKey, vueIndex);
    },
  },
  render(createElement) {
    return createElement("span");
  },
};
</script>
