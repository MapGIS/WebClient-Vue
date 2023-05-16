<template>
  <div class="mapgis-3d-m3d-menu-props">
    <mapgis-ui-input v-if="enableQuery()" :value="gdbp" size="small">
      <mapgis-ui-tooltip slot="addonAfter" placement="bottom">
        <span slot="title"
          >0.0版本/1.0版本需要地图文档绑定模型，服务要重新发一下</span
        >
        <mapgis-ui-iconfont type="mapgis-info-circle" />
      </mapgis-ui-tooltip>
    </mapgis-ui-input>
    <mapgis-ui-divider style="fontSize:14px">属性展示 </mapgis-ui-divider>
    <div
      class="mapgis-3d-popup-props-item"
      v-for="key in Object.keys(properties)"
      :key="key"
    >
      <span class="mapgis-3d-popup-props-item-key">{{ key }}</span>
      <span class="mapgis-3d-popup-props-item-value">{{
        properties[key]
      }}</span>
    </div>
    <mapgis-3d-feature-popup
      :position="position"
      :properties="properties"
      v-model="show"
    >
    </mapgis-3d-feature-popup>
  </div>
</template>

<script>
import VueOptions from "../../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-m3d-menu-props",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
  props: {
    ...VueOptions,
    version: {
      type: String
    },
    g3dLayerIndex: {
      type: Number
    },
    layerIndex: {
      type: Number
    },
    gdbp: {
      type: String
    },
    ip: {
      type: String
    },
    port: {
      type: String
    },
    domain: {
      type: String
    }
  },
  data() {
    return {
      currentMenu: undefined,
      position: {
        longitude: 0,
        latitude: 0,
        height: 0
      },
      oid: undefined,
      properties: {},
      show: false
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      const { Cesium, vueIndex, vueKey, vueCesium } = this;
      const { viewer } = this;

      let highlight = this.createCesiumObject();
      highlight.then(res => {
        let collection = new Cesium.PrimitiveCollection();
        vueCesium.G3DManager.addSource(vueKey, vueIndex, this, {
          version_0_0: {
            current: {
              feature: undefined,
              originalColor: new Cesium.Color()
            },
            currentLayer: undefined,
            analysisManager: new window.CesiumZondy.Manager.AnalysisManager({
              viewer: viewer
            }),
            collection: collection,
            primitiveCollection: viewer.scene.primitives.add(collection)
          },
          version_2_0: {}
        });

        let findViewers = vueCesium.ViewerManager.findAllSource(vueKey);
        if (findViewers && findViewers.length > 0) {
          let handler = findViewers[0].options.ScreenSpaceEventHandler;
          if (!handler) {
            handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
          } else {
            handler.removeInputAction(
              vm.$_highlightAction,
              Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
          }
          handler.setInputAction(
            vm.$_highlightAction,
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
        }
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex, version, viewer } = this;
      this.show = false;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        if (version == "0.0" || version == "1.0") {
          let { version_0_0 } = find.options;
          let {
            current,
            currentLayer,
            analysisManager,
            collection
          } = version_0_0;
          if (collection) {
            viewer.scene.primitives.remove(collection);
          }
          if (current.feature) {
            currentLayer = [current.feature.tileset];
            analysisManager.stopCustomDisplay(currentLayer);
            current.feature = undefined;
          }
        } else if (version == "2.0") {
        }
      }
      this.$emit("unload", { component: this });
      vueCesium.G3DManager.deleteSource(vueKey, vueIndex);
    },
    enableQuery() {
      let { gdbp } = this;
      let enable = false;
      if (gdbp) {
        gdbp = gdbp.toLowerCase();
        if (gdbp.indexOf("gdbp") >= 0) {
          // 0.0 1.0 的动态单体化的功能
          enable = true;
        } else if (gdbp.indexOf("file") >= 0) {
          // 2.0 的动态单体化的功能
          enable = true;
        }
      }
      return enable;
    },
    parseRule() {
      let { gdbp } = this;
      let rule = undefined;
      if (gdbp) {
        gdbp = gdbp.toLowerCase();
        if (gdbp.indexOf("gdbp") >= 0) {
          // 0.0 1.0 的动态单体化的功能
          rule = "gdbp";
        } else if (gdbp.indexOf("file") >= 0) {
          // 2.0 的动态单体化的功能
          rule = "doc";
        }
      }
      return rule;
    },
    $_highlightAction(movement) {
      const vm = this;
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { layerIndex, viewer, m3ds, version, gdbp } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      if (!tileset) {
        return;
      }

      if (version == "0.0" || version == "1.0") {
        let rule = this.parseRule();
        if (rule == "gdbp") {
          let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
          if (find && find.options && find.options.version_0_0) {
            let {
              current,
              currentLayer,
              analysisManager
            } = find.options.version_0_0;
            //根据鼠标点击位置选择对象
            let pickedFeature = viewer.scene.pick(movement.position);

            //判断current对象中要素有值，该值和鼠标点击位置不相同
            if (
              Cesium.defined(current.feature) &&
              current.feature !== pickedFeature
            ) {
              currentLayer = [current.feature.tileset];
              analysisManager.stopCustomDisplay(currentLayer);
              current.feature = undefined;
            }

            //判断点击位置是否有值，该值和鼠标点击位置不相同
            if (
              Cesium.defined(pickedFeature) &&
              current.feature !== pickedFeature
            ) {
              current.feature = pickedFeature;
              currentLayer = [current.feature.tileset];
              let title = current.feature.getProperty("name");
              let values = title.split("_");
              let vlueNumber = parseInt(values[2]);
              let idList = [vlueNumber];
              let options = {
                color: new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 0.6),
                colorBlendMode: Cesium.Cesium3DTileColorBlendMode.REPLACE
              };
              analysisManager.stopCustomDisplay(currentLayer);
              analysisManager.startCustomDisplay(currentLayer, idList, options);

              let ellipsoid = viewer.scene.globe.ellipsoid;
              let center = current.feature.tileset.boundingSphere.center;
              let cartographic = ellipsoid.cartesianToCartographic(center);
              let lat = Cesium.Math.toDegrees(cartographic.latitude);
              let lng = Cesium.Math.toDegrees(cartographic.longitude);
              let height = cartographic.height;

              vm.position.longitude = lng;
              vm.position.latitude = lat;
              vm.position.height = height;
              vm.oid = vlueNumber;
              vm.$_gdbpquery(vlueNumber, gdbp);
            } else if (
              Cesium.defined(pickedFeature) &&
              current.feature == pickedFeature
            ) {
            } else {
              vm.show = false;
            }
          }
        } else if (rule == "doc") {
          this.$_docquery(movement);
        }
      } else if (version == "2.0") {
        let oid = viewer.scene.pickOid(movement.position);
        tileset.pickedOid = oid;
        tileset.pickedColor = new Cesium.Color(1.0, 1.0, 0.0, 0.6);
      }
    },
    $_query(oid, gdbp) {
      if (!oid) return;
      let rule = this.parseRule();
      if (rule == "gdbp") {
        this.$_gdbpquery(oid, gdbp);
      } else if (rule == "doc") {
        this.$_docquery();
      }
    },
    $_gdbpquery(oid, gdbp) {
      const vm = this;
      const { ip, port, domain } = this;
      let queryParam = new window.CesiumZondy.Query.G3DDocQuery();
      queryParam.gdbp = encodeURI(gdbp);
      queryParam.structs =
        '{"IncludeAttribute":true,"IncludeGeometry":true,"IncludeWebGraphic":false}';
      queryParam.objectIds = oid;
      queryParam.serverIp = ip;
      queryParam.serverPort = port;
      queryParam.domain = domain;
      queryParam.queryG3DFeature(
        result => {
          if (result != null) {
            let keys = result.AttStruct.FldName;
            let values = result.SFEleArray[0].AttValue;
            let properties = {};
            keys.forEach((k, i) => {
              properties[k] = values[i];
            });
            vm.properties = properties;
            vm.show = true;
          }
        },
        e => {
          alert("error");
        },
        "post"
      );
    },
    /**
     * @description 地图文档的查询由于是底层在查询服务端，然后再前端绘制几何
     * 因此只地图文档关联的要素只支持经纬度的坐标系
     */
    $_docquery(movement) {
      const vm = this;
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { viewer, g3dLayerIndex, layerIndex } = this;

      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options && find.options.version_0_0) {
        let { primitiveCollection } = find.options.version_0_0;
        let cartesian = viewer.getCartesian3Position(movement.position);
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let height = cartographic.height;
          let mapPosition = { x: lng, y: lat, z: height };
          let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);

          g3dLayer.Monomerization(
            function callback(result) {
              if (result && result.length > 0) {
                let feature = result[0];
                let find = vueCesium.G3DManager.changeOptions(vueKey, vueIndex);
                if (find) {
                  let last = find.options.feature;
                  primitiveCollection.remove(last);
                }
                vm.show = true;
                vm.position = {
                  longitude: lng,
                  latitude: lat,
                  height: height
                };
                vm.properties = feature.property;
                primitiveCollection.add(feature);
                vueCesium.G3DManager.changeOptions(
                  vueKey,
                  vueIndex,
                  "feature",
                  feature
                );
              } else {
                vm.show = false;
              }
            },
            {
              position: new Cesium.Cartesian3(
                mapPosition.x,
                mapPosition.y,
                mapPosition.z
              ),
              tolerance: 0.0001,
              layerIndex: layerIndex
            }
          );
        }
      }
    }
  }
};
</script>
