<script>
import VectorTileOptions from "./VectorTileOptions";
import ServiceLayer from "../ServiceLayer";
import clonedeep from "lodash.clonedeep";
import VectorTileRender from "./VectorTileRender";

export default {
  name: "mapgis-3d-vectortile-layer",
  mixins: [ServiceLayer],
  props: { ...VectorTileOptions },
  data() {
    return {
      managerName: "VectorTileManager"
    };
  },
  inject: ["Cesium", "viewer", "vueCesium"],
  created() {},
  mounted() {
    this.$_mount();
    this.watchProp();
  },
  destroyed() {
    this.$_unmount();
  },
  watch: {
    layerStyle: {
      handler: function(next, old) {
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
      deep: true
    }
  },
  methods: {
    async createCesiumObject() {
      const { $props, viewer, vueCesium } = this;
      const { tilingScheme } = $props;
      let tileScheme;

      if (typeof tilingScheme === "string") {
        tileScheme = this.checkTiling(tilingScheme);
      } else {
        tileScheme = tilingScheme;
      }

      return new Promise(
        resolve => {
          let vectortile;
          const opt = {
            ...$props,
            tilingScheme: tileScheme,
            callback: () => {
              resolve(vectortile);
            }
          };
          vectortile = new VectorTileRender(viewer, opt);
        },
        reject => {}
      );
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
    watchProp() {
      const {
        vueCesium,
        viewer,
        vueKey,
        vueIndex,
        show,
        mvtStyle,
        vectortilejson
      } = this;
      let find = vueCesium.VectorTileManager.findSource(vueKey, vueIndex);

      if (show) {
        this.$watch("show", function(next) {
          if (this.initial) return;
          if (find) {
            !viewer.isDestroyed() && find.source.setVisible(next);
          }
        });
      }
      if (mvtStyle) {
        this.$watch("mvtStyle", {
          handler(nextStyle) {
            if (typeof nextStyle === "object") {
              !viewer.isDestroyed() && this.$vectortile.updateStyle(nextStyle);
            }
          },
          deep: true
        });
      }
      if (vectortilejson) {
        this.$watch("vectortilejson", {
          handler(nextStyle) {
            if (
              typeof nextStyle === "object" &&
              this.$vectortile !== undefined
            ) {
              !viewer.isDestroyed() && this.$vectortile.updateStyle(nextStyle);
            }
          },
          deep: true
        });
      }
    },
    updateStyle(style) {
      this.$vectortile.updateStyle(style);
    },
    provider() {
      return this.$vectortile ? this.$vectortile.provider : undefined;
    },
    $_mount() {
      const { vueIndex, vueKey, vueCesium } = this;
      const { layerStyle } = this;
      const { visible, opacity, zIndex } = layerStyle;
      //取得webGlobe对象，防止当页面有多个webGlobe只会取得
      let viewer = this.$_getWebGlobe();
      const { imageryLayers } = viewer;

      if (viewer.isDestroyed()) return;
      this.$emit("load", this);
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(vectortile => {
        vm.$vectortile = vectortile;
        let imageryLayer = vectortile.provider;

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
      });
    },
    $_unmount() {
      const { viewer, vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.VectorTileManager.findSource(vueKey, vueIndex);
      if (find) {
        !viewer.isDestroyed() && find.options.vectortile.destroy();
      }
      vueCesium.VectorTileManager.deleteSource(vueKey, vueIndex);
    }
  },
  render(createElement) {
    return createElement("span");
  }
};
</script>
