<template>
  <div class="cesium-map-wrapper">
    <div v-once :id="container" ref="container" />
    <slot v-if="initialized" />
  </div>
</template>

<script>
import "@mapgis/cesium/dist/Widgets/widgets.css";
import withPrivateMethods from "./mixins/withPrivateMethods";
import withEvents from "../../lib/withEvents";
// import mapEvents from "./events";
import { flyTo, flyToEx } from "./util";
import { initManager, initVueCesium } from "./manager";
import options from "./options";
import debounce from "lodash/debounce";

export default {
  name: "mapgis-web-scene",

  mixins: [withEvents, withPrivateMethods],

  props: {
    libPath: {
      type: String,
    },
    height: {
      type: Number,
    },
    // 风场可视化库(netcdfjs)的资源路径
    netCDFPath: {
      type: String,
      default: "/netcdf/netcdfjs.min.js",
    },
    ...options,
  },

  provide() {
    const self = this;
    return {
      get Cesium() {
        return self.Cesium;
      },
      get vueCesium() {
        return self.vueCesium;
      },
      get viewer() {
        return self.viewer;
      },
    };
  },

  data() {
    return {
      initialized: false,
    };
  },
  watch: {
    height: {
      handler: function () {
        //解决分屏时，cesium无限拉长的问题，要给一个固定高度
        let vm = this;
        window.vueCesium.getViewerByInterval(function (viewer) {
          vm.$nextTick(function () {
            viewer.container.style.height = this.height + "px";
          });
        }, this.vueKey);
      },
    },
  },
  methods: {
    async loadScript() {
      await this.$_loadScript();
    },
    flyTo(globeView) {
      flyTo(globeView, this.viewer);
    },
    flyToEx(globeView) {
      flyToEx(globeView, this.viewer);
    },
    // 获取当比例尺为1时，对于的zoom
    getScaleOneZoom() {
      // 标准4326的裁图比例尺
      let initScale = 295829355.45;
      let zoom = 1;
      for (let i = 1; i < 30; i++) {
        initScale = initScale / 2;
        if (initScale < 2 && initScale >= 1) {
          zoom = i;
        }
      }
      return zoom;
    },
    /**
     * 根据zoom范围设置相机位置，如果视图中心点分辨率对应的级别超出设置的级别范围，则将相机位置回弹到设定的范围内
     */
    resetCameraPos() {
      if (this.minZoom !== undefined && this.maxZoom !== undefined) {
        const { viewer, Cesium } = this;
        const self = this;

        if (this.cameraChangedListener) {
          viewer.camera.changed.removeEventListener(this.cameraChangedListener);
        }
        // 记录变化前的相机位置和方位信息，方便回弹设置
        const tempPosition = new Cesium.Cartesian3();
        const { position, heading, pitch, roll } = viewer.camera;
        Cesium.Cartesian3.clone(position, tempPosition);
        this.preCameraPos = {
          position,
          heading,
          pitch,
          roll,
        };

        this.scaleOneZoom = this.getScaleOneZoom();

        // 监听相机变化
        this.cameraChangedListener = viewer.camera.changed.addEventListener(
          debounce(
            (camera) => {
              // 是否显示地球
              const isShowGlobe = viewer.scene.globe.show;
              // 是否为地下模式,isEnableCollisionDetection为false时，表示为地下模式
              const isEnableCollisionDetection =
                viewer.scene.screenSpaceCameraController
                  .enableCollisionDetection;

              // 当地球未显示，或者开启地下模式，或者设置的最大级别比比例尺为1：1的时候的级别相等或者还大时，则不回弹
              if (
                !isShowGlobe ||
                !isEnableCollisionDetection ||
                self.maxZoom >= self.scaleOneZoom
              ) {
                return;
              }

              // 获取当前视图中心点对应的级别，如果超出设置的级别范围，则回弹
              const currentZoom = self.getCurrentZoom();
              if (currentZoom < 1) {
                return;
              }
              if (currentZoom > self.maxZoom || currentZoom < self.minZoom) {
                // 恢复相机位置和方位
                const { position, heading, pitch, roll } = self.preCameraPos;
                viewer.camera.setView({
                  destination: position,
                  orientation: {
                    heading,
                    pitch,
                    roll,
                  },
                });
                const messageText =
                  currentZoom > self.maxZoom
                    ? `地图最大显示级数${self.maxZoom}`
                    : `地图最小显示级数${self.minZoom}`;
                self.$message.warning(
                  `当前视图的显示级数已超出您设置的${messageText}`
                );
              } else {
                // 记录上次变化的相机位置和方位信息，方便回弹设置
                const tempPosition = new Cesium.Cartesian3();
                const { position, heading, pitch, roll } = viewer.camera;
                Cesium.Cartesian3.clone(position, tempPosition);
                self.preCameraPos = {
                  position: tempPosition,
                  heading,
                  pitch,
                  roll,
                };
              }
            },
            100,
            { leading: true }
          )
        );
      }
    },
    /**
     * 获取当前中心点的对于的级别
     * @returns resolution
     */
    getCurrentZoom() {
      // 范围对象
      const extent = {
        xmin: -180,
        ymax: 90,
        xmax: 180,
        ymin: -90,
        height: 0,
      };
      const { viewer, Cesium } = this;
      const rectangle = viewer.camera.computeViewRectangle();
      if (typeof rectangle === "undefined") {
        // 如果通过以上方法获取不到范围，则通过视图四个顶点，计算范围
        const coordToLonlat = (viewer, x, y) => {
          const { camera, scene } = viewer;
          const d2 = new Cesium.Cartesian2(x, y);
          // 如果d2，d3为undefined，则直接返回0
          if (!d2) {
            return 0;
          }
          const ellipsoid = scene.globe.ellipsoid;
          // 2D转3D世界坐标
          const d3 = camera.pickEllipsoid(d2, ellipsoid);
          if (!d3) {
            return 0;
          }
          // 3D世界坐标转弧度
          const upperLeftCartographic =
            scene.globe.ellipsoid.cartesianToCartographic(d3);
          // 弧度转经纬度
          const lon = Cesium.Math.toDegrees(upperLeftCartographic.longitude);
          const lat = Cesium.Math.toDegrees(upperLeftCartographic.latitude);
          return { lon, lat };
        };
        const canvas = viewer.scene.canvas;
        const upperLeftLonLat = coordToLonlat(viewer, 0, 0);
        const lowerRightLonLat = coordToLonlat(
          viewer,
          canvas.clientWidth,
          canvas.clientHeight
        );
        extent.xmin = upperLeftLonLat.lon;
        extent.ymin = lowerRightLonLat.lat;
        extent.xmax = lowerRightLonLat.lon;
        extent.ymax = upperLeftLonLat.lat;
      } else {
        // 三维视图
        extent.xmin = Cesium.Math.toDegrees(rectangle.west);
        extent.ymin = Cesium.Math.toDegrees(rectangle.south);
        extent.xmax = Cesium.Math.toDegrees(rectangle.east);
        extent.ymax = Cesium.Math.toDegrees(rectangle.north);
      }
      const { xmin, ymin, xmax, ymax } = extent;
      const center = {
        lng: (xmin + xmax) / 2,
        lat: (ymin + ymax) / 2,
      };
      const zoom = this.getZoomAndResolution(center).zoom;
      return zoom;
    },

    /**
     * cesium获取指定点的显示级别和分辨率
     * @param lnglat 经纬度坐标
     * @returns {zoom,resolution}
     */
    getZoomAndResolution(lnglat) {
      const { viewer, Cesium } = this;
      const tileList = viewer.scene.globe._surface._tilesToRender;
      const coords = {
        lng: Cesium.Math.toRadians(lnglat.lng),
        lat: Cesium.Math.toRadians(lnglat.lat),
      };
      let maxLevel = -1;
      let correctTile;
      tileList.forEach((tile) => {
        if (
          coords.lng >= tile._rectangle.west &&
          coords.lng <= tile._rectangle.east &&
          coords.lat >= tile._rectangle.south &&
          coords.lat <= tile._rectangle.north
        ) {
          if (maxLevel < tile._level) {
            maxLevel = tile._level;
            correctTile = tile;
          }
        }
      });
      let texelSpacing;
      if (maxLevel > -1) {
        texelSpacing =
          1.0 *
          viewer.terrainProvider.getLevelMaximumGeometricError(
            correctTile.level
          );
      }
      return {
        zoom: maxLevel,
        resolution: texelSpacing,
      };
    },
  },

  created() {
    initManager();
    initVueCesium();
    this.viewer = null;
    this.propsIsUpdating = {};
    window.viewer = window.viewer || null;
    this.initialized = false;
  },

  mounted() {
    const { vueKey, vueIndex } = this;
    const { cameraView } = this;
    let vm = this;
    this.$_loadScript().then((Cesium) => {
      this.Cesium = Cesium;
      this.vueCesium = window.vueCesium;
      let container = this.$refs.container;
      let viewer = new Cesium.Viewer(container, {
        ...this._props,
      });
      this.viewer = viewer;

      //解决分屏时，cesium无限拉长的问题，要给一个固定高度
      if (this.height) {
        this.$nextTick(function () {
          viewer.container.style.height = this.height + "px";
        });
      }

      viewer.vueKey = vueKey;
      if (cameraView) {
        viewer.scene.camera.setView(cameraView);
      }
      window.vueCesium.GlobesManager.addSource(vueKey, vueIndex, viewer, {
        ScreenSpaceEventHandler: undefined,
      });
      window.vueCesium.ViewerManager.addSource(vueKey, vueIndex, viewer, {
        // 专门提供给M3D、G3D做查询用处
        ScreenSpaceEventHandler: undefined,
      });

      // 修改之前
      // window.viewer = window.viewer || viewer;
      // 修改之后
      window.viewer = viewer;
      viewer.cesiumWidget.readyPromise &&
        viewer.cesiumWidget.readyPromise.then(function (globe) {
          vm.$emit("webGlobeLoaded", globe);
        });
      this.initialized = true;
      // 这里禁止吧cesium示例化后的viewer传上去，此处会发生vue劫持操作，导致内存溢出
      this.$emit("load", {
        component: this,
        Cesium: Cesium,
        vueCesium: window.vueCesium,
      });
      if (this.container) {
        let dom = document.getElementById(this.container);
        if (dom) {
          dom.style.height = "100%";
        }
      }
      this.resetCameraPos();
    });
  },

  beforeDestroy() {
    this.$nextTick(() => {
      if (this.viewer) {
        const { vueKey, vueIndex } = this;
        this.viewer.scene.primitives.removeAll();
        this.viewer.scene.primitives.destroy();
        this.viewer.entities.removeAll();
        // this.viewer.destroy();
        window.vueCesium.GlobesManager.deleteSource(vueKey, vueIndex);
        window.vueCesium.ViewerManager.deleteSource(vueKey, vueIndex);

        if (this.cameraChangedListener) {
          viewer.camera.changed.removeEventListener(this.cameraChangedListener);
        }
        // this.viewer = null;
        this.initialized = false;
      }
    });
  },
};
</script>

<style>
.cesium-map-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
