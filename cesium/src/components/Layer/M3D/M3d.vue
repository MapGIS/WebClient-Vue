<template>
  <Popup
    v-if="modelSwitchVisible"
    :visible="modelSwitchVisible"
    :position="iClickPosition"
    forceRender
  >
    <mapgis-ui-popup-content class="mapgis-multi-model-status-popup">
      <modelSwitchPopup :tile="tile" @handleModel="handleModel">
      </modelSwitchPopup>
    </mapgis-ui-popup-content>
  </Popup>
  <!-- <mapgis-3d-virtual-popup
    v-else-if="popupShowType === 'default'"
    :enablePopup="enablePopup"
    :enableTips="enableTips"
    :enableIot="iEnableIot"
    :popupOptions="popupOptions"
    :tipsOptions="tipsOptions"
    :iotOptions="iotOptions"
    :clickVisible="iClickVisible"
    :clickPosition="iClickPosition"
    :clickFeatures="iClickFeatures"
  >
  </mapgis-3d-virtual-popup> -->
  <mapgis-3d-feature-popup
    v-else-if="popupShowType === 'default' && featureposition"
    :position="featureposition"
    :popupOptions="popupOptions"
    :componentWidth="popupWidth"
    v-bind="popupConfig"
  >
    <component
      :is="popupComponent"
      :properties="featureproperties"
      :dataStoreIp="dataStoreIp"
      :dataStorePort="dataStorePort"
      :dataStoreDataset="dataStoreDataset"
      v-bind="popupConfig"
    />
  </mapgis-3d-feature-popup>
</template>

<script>
import { G3D } from "@mapgis/webclient-es6-service";
import Tileset3dOptions from "./3DTilesetOptions";
import { M3dType, M3dType_0_0 } from "./M3dType";
import PopupMixin from "../Mixin/PopupMixin";
import modelSwitchPopup from "./components/M3dModelSwitch";
import Popup from "../../UI/Popup/Popup.vue";
import * as Feature from "../../service/comprehensive-query/util/feature";

const { M3DTileDataInfo } = G3D;

export default {
  name: "mapgis-3d-m3d-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [PopupMixin],
  props: {
    ...Tileset3dOptions,
    // 右侧展示气泡框props
    popupShowType: {
      type: String,
      default: "default"
    },
    popupOverlay: {
      type: Object,
      default: () => {}
    },
    dataStoreIp: {
      type: String,
      default: "192.168.96.101"
    },
    dataStorePort: {
      type: String,
      default: "9014"
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1"
    },
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      }
    },
    // 挂靠的查询参数，比如三维简单要素类，如果有挂靠的查询参数，则拾取的要素属性使用从三维简单要素类里的内容
    searchParams: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    modelSwitchPopup,
    Popup
  },
  data() {
    return {
      layerIndex: undefined,
      layerList: undefined,
      version: undefined,
      modelSwitchVisible: false,
      tileIndex: undefined,
      tile: {},
      iEnableIot: false,
      featureposition: undefined,
      featureproperties: undefined
    };
  },
  created() {},
  mounted() {
    this.layerList = this.parseLayers(this.layers);
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    tileIndex(next) {
      this.tile.tileIndex = next;
    },
    url(next) {
      this.unmount();
      this.mount();
    },
    layers(next) {
      if (this.initial) return;
      this.layerList = this.parseLayers(next);
      this.changeLayerVisible(this.layerList);
    },
    show(next) {
      if (this.initial) return;
      this.changeShow(next);
    },
    opacity(next) {
      if (this.initial) return;
      if (next >= 0 && next <= 1) {
        this.changeOpacity(next);
      }
    },
    enablePopup(next) {
      if (next) {
        this.bindPopupEvent();
      } else {
        this.unbindPopupEvent();
      }
    },
    enableIot(next) {
      this.iEnableIot = next;
    }
  },
  /* render(h) {
    return this.$_render(h);
  }, */
  methods: {
    handleModel(index) {
      const vm = this;
      vm.tileIndex = index;
      vm.modelSwitchVisible = false;
    },
    createCesiumObject() {
      const vm = this;
      const { vueCesium, viewer, url } = this;
      return new Promise(
        resolve => {
          // M3D服务调用Cesium底层appendM3DLayer方法
          let options = this.getOptions();
          options.loaded = function() {
            resolve({ layerIndex: vm.layerIndex });
          };
          vm.layerIndex = viewer.scene.layers.appendM3DLayer(url, options);
        },
        reject => {}
      );

      return m3dLayer;
    },
    // 解决 ...props报错
    getOptions() {
      const { $props } = this;
      let options = {};
      Object.keys($props).forEach(function(key) {
        options[key] = $props[key];
      });
      return options;
    },
    parseM3dVersion() {},
    mount() {
      const vm = this;
      const { viewer, vueIndex, vueKey, vueCesium, $props } = this;
      const { url } = this;

      if (viewer.isDestroyed()) return;

      let promise = this.createCesiumObject();
      promise.then(payload => {
        const { layerIndex } = payload;
        if (layerIndex >= 0) {
          // 2.0版本的处理方式
          /**
           * @修改说明 临时解决m3dLayer获取失败问题
           * @修改人 龚跃健
           * @修改时间 2022/2/22
           */
          vm.layerIndex = layerIndex;
          let m3dLayer;
          m3dLayer = viewer.scene.layers.m3dLayersMap.get(layerIndex);
          let m3ds = [m3dLayer];
          vm.loopM3d(m3ds, "2.0");
          vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
            version: "2.0",
            url: url
          });
          vm.$emit("loaded", { tileset: m3dLayer, m3ds: m3ds });
          vm.bindPopupEvent();
        }
      });
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      this.removeLayer();
      // 直接调用cesium底层MapGISM3DSet的destroy方法会导致地球卡死的问题，目前改用统一的layers管理图层，移除图层并销毁内存中的资源
      // this.unbindSource();
      this.unbindPopupEvent();
      this.$emit("unload", { component: this });
      vueCesium.M3DIgsManager.deleteSource(vueKey, vueIndex);
    },
    removeLayer() {
      const { url, layerIndex } = this;
      if (layerIndex === undefined) {
        return;
      }

      const layer = viewer.scene.layers.getLayer(layerIndex);
      if (!layer) return;
      if (viewer.scene.layers.m3dLayersMap.length > 0) {
        viewer.scene.layers.removeM3DLayerByID(layerIndex);
      }
    },
    unbindSource() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        !viewer.isDestroyed() &&
          m3ds &&
          m3ds.forEach(l => {
            l.destroy();
          });
      }
    },
    bindPopupEvent() {
      const { vueKey, vueIndex } = this;
      const { enablePopup, enableTips, enableModelSwitch } = this;

      let clickhandler, hoverhandler;
      if (enablePopup || enableModelSwitch) {
        clickhandler = this.$_bindClickEvent(
          this.pickFeature,
          this.cancelFeature,
          true,
          false
        );
      }
      if (enableTips) {
        hoverhandler = this.$_bindHoverEvent(this.pickFeature);
      }
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "clickhandler",
        clickhandler
      );
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "hoverhandler",
        hoverhandler
      );
    },
    unbindPopupEvent() {
      const { Cesium, vueCesium, vueKey, vueIndex } = this;
      const { highlightStyle, layerIndex } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        if (find.options.clickhandler) {
          find.options.clickhandler.destroy();
        }
        if (find.options.hoverhandler) {
          find.options.hoverhandler.destroy();
        }
      }
      // 关闭右侧气泡框
      this.popupOverlay && this.popupOverlay.setContent(null);

      let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      if (tileset) {
        tileset.pickedOid = 0;
        tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
      }
      this.featureposition = undefined;
      this.featureproperties = undefined;
    },
    async pickFeature(payload) {
      const vm = this;
      const { movement } = payload;

      const { popupOptions, highlightStyle, vueKey, vueIndex } = this;
      // const { color = "rgba(255, 255, 0, 0.6)" } = highlightStyle;
      const { viewer } = this;
      const { version, layerIndex } = this;

      /* 只有在多模态下为真 */
      vm.modelSwitchVisible = false;
      let feature = viewer.scene.pick(movement.position);
      /* 多模态切换 */
      if (vm.enableModelSwitch) {
        vm.tile = feature.content.tile.searchMultimodalTile();
        vm.modelSwitchVisible = true;
        return;
      }
      let oid = viewer.scene.pickOid(movement.position);
      let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      if (feature.tileset !== tileset) {
        // tileset.pickedOid = oid;
        // tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
        // this.featureposition = undefined;
        // this.featureproperties = undefined;
        // this.uniqueKey = undefined;

        // 拾取非当前tileset时不进行关闭，让高亮和气泡框展示
        // this.cancelFeature(payload);
        return;
      }
      vueCesium.M3DIgsManager.changeOptions(vueKey, vueIndex, "pick", tileset);
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "pickStyle",
        tileset.pickedColor || Cesium.Color.fromCssColorString(highlightStyle)
      );
      tileset.pickedOid = oid;
      tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
      let titlefield = popupOptions ? popupOptions.title : undefined;
      const properties = await this.getFeaturePorpertiesByOid(oid);
      if (Object.keys(properties).length > 0) {
        if (this.popupShowType === "default") {
          vm.featureproperties = properties;
        } else {
          // title放在最前面
          let popupContent = {};
          popupContent = properties[titlefield]
            ? { title: properties[titlefield], ...properties }
            : { ...properties };
          vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
        }
      } else {
        if (tileset._useRawSaveAtt && Cesium.defined(feature)) {
          let result = feature.content.getAttributeByOID(oid) || {};
          if (this.popupShowType === "default") {
            // vm.iClickFeatures = [
            //   { properties: result, title: result[titlefield] }
            // ];
            vm.featureproperties = result;
          } else {
            // title放在最前面
            let popupContent = {};
            popupContent = result[titlefield]
              ? { title: result[titlefield], ...result }
              : { ...result };
            vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
          }
        } else {
          tileset.queryAttributes(oid).then(function(result) {
            result = result || {};
            if (this.popupShowType === "default") {
              // vm.iClickFeatures = [
              //   { properties: result, title: result[titlefield] }
              // ];
              vm.featureproperties = result;
            } else {
              // title放在最前面
              let popupContent = {};
              popupContent = result[titlefield]
                ? { title: result[titlefield], ...result }
                : { ...result };
              vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
            }
          });
        }
      }
      if (this.popupShowType === "default" && vm.iClickPosition) {
        vm.featureposition = vm.iClickPosition;
        // let clickinfo = vm.iClickFeatures[0];
        // const { properties } = clickinfo;
        // if (properties) {
        //   Object.keys(properties).forEach(k => {
        //     if (k.toLowerCase() == "euid") vm.iEnableIot = true;
        //   });
        // }
      }

      // if (version == "0.0" || version == "1.0") {
      // } else if (version == "2.0") {
      //   /* 只有在多模态下为真 */
      //   vm.modelSwitchVisible = false;
      //   let feature = viewer.scene.pick(movement.position);
      //   /* 多模态切换 */
      //   if (vm.enableModelSwitch) {
      //     vm.tile = feature.content.tile.searchMultimodalTile();
      //     vm.modelSwitchVisible = true;
      //     return;
      //   }
      //   let oid = viewer.scene.pickOid(movement.position);
      //   let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      //   if (feature.tileset !== tileset) {
      //     // tileset.pickedOid = oid;
      //     // tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
      //     // this.featureposition = undefined;
      //     // this.featureproperties = undefined;
      //     // this.uniqueKey = undefined;
      //     this.cancelFeature(payload);
      //     return;
      //   }
      //   vueCesium.M3DIgsManager.changeOptions(
      //     vueKey,
      //     vueIndex,
      //     "pick",
      //     tileset
      //   );
      //   vueCesium.M3DIgsManager.changeOptions(
      //     vueKey,
      //     vueIndex,
      //     "pickStyle",
      //     tileset.pickedColor || Cesium.Color.fromCssColorString(highlightStyle)
      //   );
      //   tileset.pickedOid = oid;
      //   tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
      //   let titlefield = popupOptions ? popupOptions.title : undefined;
      //   if (tileset._useRawSaveAtt && Cesium.defined(feature)) {
      //     let result = feature.content.getAttributeByOID(oid) || {};
      //     if (this.popupShowType === "default") {
      //       // vm.iClickFeatures = [
      //       //   { properties: result, title: result[titlefield] }
      //       // ];
      //       vm.featureproperties = result;
      //     } else {
      //       // title放在最前面
      //       let popupContent = {};
      //       popupContent = result[titlefield]
      //         ? { title: result[titlefield], ...result }
      //         : { ...result };
      //       vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
      //     }
      //   } else {
      //     tileset.queryAttributes(oid).then(function(result) {
      //       result = result || {};
      //       if (this.popupShowType === "default") {
      //         // vm.iClickFeatures = [
      //         //   { properties: result, title: result[titlefield] }
      //         // ];
      //         vm.featureproperties = result;
      //       } else {
      //         // title放在最前面
      //         let popupContent = {};
      //         popupContent = result[titlefield]
      //           ? { title: result[titlefield], ...result }
      //           : { ...result };
      //         vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
      //       }
      //     });
      //   }
      //   if (this.popupShowType === "default" && vm.iClickPosition) {
      //     vm.featureposition = vm.iClickPosition;
      //     // let clickinfo = vm.iClickFeatures[0];
      //     // const { properties } = clickinfo;
      //     // if (properties) {
      //     //   Object.keys(properties).forEach(k => {
      //     //     if (k.toLowerCase() == "euid") vm.iEnableIot = true;
      //     //   });
      //     // }
      //   }
      // }
    },
    cancelFeature(payload) {
      const { movement } = payload;
      const { version, layerIndex } = this;
      const { highlightStyle } = this;
      let oid = viewer.scene.pickOid(movement.position);

      let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      tileset.pickedOid = oid;
      tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
      this.featureposition = undefined;
      this.featureproperties = undefined;
      // if (version == "0.0" || version == "1.0") {
      // } else if (version == "2.0") {
      //   let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      //   tileset.pickedOid = oid;
      //   tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
      //   this.featureposition = undefined;
      //   this.featureproperties = undefined;
      //   // if (!oid) {
      //   //   this.featureposition = undefined;
      //   //   this.featureproperties = undefined;
      //   //   this.uniqueKey = undefined;
      //   // }
      // }
      this.popupOverlay && this.popupOverlay.setContent(null);
    },
    changeShow(show) {
      const { vueKey, vueIndex } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        m3ds && m3ds.forEach(m3d => (m3d.show = show));
      }
      this.layerList = this.parseLayers();
      this.changeLayerVisible(this.layerList);
    },
    changeOpacity(opacity) {
      const { vueKey, vueIndex } = this;
      const vm = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach(m3d => {
          let type = vm.checkType(m3d);
          type = type == M3dType.UnKnow ? m3d.type : type;
          if (type == M3dType.Model || type == M3dType.Instance) {
            m3d.style = new Cesium.Cesium3DTileStyle({
              color: `color('#FFFFFF', ${opacity})`
            });
          }
        });
      }
    },
    checkType(tileset, callback) {
      const vm = this;
      let m3dType = M3dType.UnKnow;
      if (!tileset._root) return m3dType;
      const { root } = tileset;
      const version = root.tileset._version;
      let { children } = root;
      if (version == "0.0" || version == "1.0") {
        // m3d 0.x  1.x版本逻辑判断 type =0是模型 =1是示例化数据 =2是点云
        if (!children || children.length <= 0) return m3dType;
        children.forEach(child => {
          let tempType = vm.checkTypeNode(child, version, callback);
          m3dType = tempType || m3dType;
        });
      } else if (version == "2.0") {
        if (!children || children.length <= 0) return m3dType;
        children.forEach(child => {
          let tempType = vm.checkTypeNode(child, version, callback);
          m3dType = tempType ? tempType : m3dType;
        });
      }

      return m3dType;
    },
    checkTypeNode(tileset, version, callback) {
      let m3dType;
      const vm = this;
      if (!tileset) return m3dType;
      if (tileset._content) {
        let type = tileset._content._dataType;
        if (type >= 0) {
          if (version == "0.0" || version == "1.0") {
            switch (type) {
              case M3dType_0_0.Model:
                m3dType = M3dType.Model;
                break;
              case M3dType_0_0.Instance:
                m3dType = M3dType.Instance;
                break;
              case M3dType_0_0.CloudPoint:
                m3dType = M3dType.CloudPoint;
                break;
            }
          } else if (version == "2.0") {
            switch (type) {
              case M3DTileDataInfo.Model:
                m3dType = M3dType.Model;
                break;
              case M3DTileDataInfo.Vector:
                m3dType = M3dType.Instance;
                break;
              case M3DTileDataInfo.CloudPoint:
                m3dType = M3dType.CloudPoint;
                break;
            }
          }
          if (callback) {
            callback(m3dType);
          }
          return m3dType;
        }
      }

      tileset.children.forEach(child => {
        let tempType = vm.checkTypeNode(child, version, callback);
        m3dType = tempType ? tempType : m3dType;
      });

      return m3dType;
    },
    loopM3d(m3ds, version) {
      const vm = this;
      const { vueKey, vueIndex, vueCesium, opacity, url } = this;
      let dataCallback = cbtype => {
        if (loop) {
          window.clearInterval(loop);
          loop = undefined;
          m3ds.forEach(m3d => {
            let type = vm.checkType(m3d);
            m3d.type = type || cbtype;
            switch (type) {
              case M3dType.Model:
              case M3dType.Instance:
                m3d.style = new Cesium.Cesium3DTileStyle({
                  color: `color('#FFFFFF', ${opacity})`
                });
                break;
              case M3dType.CloudPoint:
                // 0.0 1.0版本无法激活Cesium自带得下列样式代码，只能在2.0以后的版本实现透明度的改变
                /* m3d.style = new Cesium.Cesium3DTileStyle({
                        color: {
                          conditions: [["true", "color('#FFFF00', 0.25)"]]
                        }
                      }); */
                break;
              case M3dType.UnKnow:
                break;
            }
          });
          vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
            url: url
          });
        }
      };
      // let loop = window.setInterval(() => {
      m3ds.forEach(m3d => {
        vm.checkType(m3d, dataCallback);
      });
      // }, 100);
    },
    parseLayers(layerString) {
      layerString = layerString || this.layers;
      if (!layerString) return undefined;
      let pattern = new RegExp(/layers=show:/i);
      if (!pattern.test(layerString)) {
        console.warn("layers格式错误，格式为layers=show:0,1,2");
      }
      let layerStr = layerString.replace(/layers=show:/i, "");
      let layerStrs = layerStr.split(",");
      let layers = layerStrs.map(l => parseInt(l));
      return layers;
    },
    changeLayerVisible(layers) {
      layers = layers || this.layerList;
      const { vueKey, vueIndex, show } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach(m3d => {
          if (layers) {
            m3d.show = true;
            // @description cesium 1.84 (M3D 2.0)将layerIndex内部隐藏起来了
            // @date 20211112 潘卓然， 等到三维放开这个属性后还原
            if (layers.indexOf(m3d.layerIndex || m3d._layerIndex) >= 0) {
            } else {
              m3d.show = false;
            }
          } else {
            m3d.show = show;
          }
        });
      }
    },
    async getFeaturePorpertiesByOid(oid) {
      const properties = {};
      if (this.searchParams) {
        const { domain, serverName, layerIndex, gdbp } = this.searchParams;
        const featureSet = await Feature.FeatureQuery.query(
          {
            domain,
            f: "json",
            IncludeAttribute: true,
            IncludeGeometry: false,
            IncludeWebGraphic: false,
            where: null,
            gdbp,
            docName: serverName,
            layerIdxs: layerIndex,
            rtnLabel: false,
            objectIds: oid,
            requestType: "POST"
          },
          false,
          true
        );
        if (featureSet && featureSet.SFEleArray) {
          const { AttStruct, SFEleArray } = featureSet;
          const { FldAlias, FldName } = AttStruct;
          const { AttValue } = SFEleArray[0];

          for (let i = 0; i < AttValue.length; i++) {
            const tag = FldAlias[i] ? FldAlias[i] : FldName[i];
            properties[tag] = AttValue[i];
          }
        }
      }
      return properties;
    }
  }
};
</script>
