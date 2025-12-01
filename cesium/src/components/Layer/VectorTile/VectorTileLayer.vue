<script>
import { IGSVectorTileLayer } from "@mapgis/webclient-common";
import {
  MapGISVectorTileImageryProvider,
  initializeOptions,
} from "@mapgis/webclient-cesium-plugin";
import VectorTileOptions from "./VectorTileOptions";
import ServiceLayer from "../ServiceLayer";
import clonedeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import { Util } from "@mapgis/webclient-vue-ui";
const { UrlUtil } = Util;

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
          layer.show = this.layerStyle.visible;
        }
        if (this.layerStyleCopy.opacity !== this.layerStyle.opacity) {
          layer.alpha = this.layerStyle.opacity;
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
      return new Promise(
        async (resolve) => {
          // 添加矢量图层
          const vectortile = this.$_addLayer({});
          resolve(vectortile);
        },
        (reject) => {}
      );
    },
    // 添加图层
    async $_addLayer(opt) {
      const { viewer, $props } = this;
      const commonLayer = await this.getIGSVectorTileLayer();
      if (!commonLayer) {
        return;
      }
      const cesiumOptions = initializeOptions(commonLayer, viewer);
      const { rectangle } = cesiumOptions;
      if (rectangle) {
        const { west, south, east, north } = rectangle;
        // 如果范围无效，则不加载
        if (west >= east || south >= north) {
          return;
        }
      }
      const optMinimumLevel = $props.options.minimumLevel || 0;
      const optMaximumLevel = $props.options.maximumLevel || 22;
      const minimumLevel = Math.max(
        optMinimumLevel,
        cesiumOptions.minimumLevel
      );
      const maximumLevel = Math.min(
        optMaximumLevel,
        cesiumOptions.maximumLevel
      );

      const options = {
        ...cesiumOptions,
        show: $props.visible ? $props.visible : true,
        opacity: $props.opacity ? $props.opacity : 1,
        minimumLevel,
        maximumLevel,
      };
      const vectorTileProvider = new MapGISVectorTileImageryProvider(options);
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
    // 获取适量瓦片样式对象
    getIGSVectorTileLayer() {
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
            if (this.ip && this.layerName) {
              const { ip, port } = this;
              styleUrl = `${UrlUtil.getOrigin({
                ip,
                port,
              })}/igs/rest/mrcs/vtiles/0/${this.layerName}`;
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
          const { token } = this;
          const options = {
            url: styleUrl,
            style: styleObject,
            extensionOptions: this.options?.extensions
              ? this.options.extensions
              : {},
          };

          if (token.key && token.value) {
            options.tokenKey = token.key;
            options.tokenValue = token.value;
          }
          const igsVectorTileLayer = new IGSVectorTileLayer(options);
          igsVectorTileLayer.load().then((layer) => {
            if (!layer.loaded) {
              resolve(null);
            }
            resolve(layer);
          });
        }
      });
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
            // const isEqualStyle = isEqual(nextStyle, oldStyle);
            // // 判断条件中增加比较新旧style值的逻辑。当nextStyle和oldStyle的对象属性值相同，不更新style。
            // if (
            //   typeof nextStyle === "object" &&
            //   !isEqualStyle &&
            //   this.$vectortile !== undefined &&
            //   !viewer.isDestroyed()
            // ) {
            //   this.updateStyle(nextStyle);
            // }
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
