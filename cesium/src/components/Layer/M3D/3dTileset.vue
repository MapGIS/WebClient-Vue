<template>
  <mapgis-3d-feature-popup
    v-if="featureposition"
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
import TilesetOptions from "./3DTilesetOptions";
import PopupMixin from "../Mixin/PopupMixin";
import { Cesium3DTilesCacheLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";
export default {
  name: "mapgis-3d-3dtiles-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [PopupMixin],
  props: {
    ...TilesetOptions,
    // 右侧展示气泡框props
    popupShowType: {
      type: String,
      default: "default",
    },
    // 气泡框对象
    popupOverlay: {
      type: Object,
      default: () => {},
    },
    // datastore服务器ip
    dataStoreIp: {
      type: String,
      default: "192.168.96.101",
    },
    // datastore服务器port
    dataStorePort: {
      type: String,
      default: "9014",
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1",
    },
    // 弹出框属性
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      },
    },
    // token信息
    token: {
      type: Object,
    },
  },
  data() {
    return {
      // 拾取的要素位置
      featureposition: undefined,
      // 拾取的要素属性
      featureproperties: undefined,
    };
  },
  watch: {
    // 监听tileset透明度设置变化
    opacity(next) {
      if (next >= 0 && next <= 1) {
        this.changeOpacity(next);
      }
    },
    // 是否显示弹框
    enablePopup(next) {
      if (next) {
        this.bindPopupEvent();
      } else {
        this.unbindPopupEvent();
      }
    },
    // 监听tileset的显示/隐藏设置变化
    show(next) {
      const { viewer } = this;
      const tileset = this.getTileSet();
      if (!tileset) {
        return;
      }
      tileset.show = next;
    },
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    /**
     * 构造tileset初始化options
     */
    getOptions() {
      const { $props } = this;
      let options = {};
      // 新增extensions属性
      // 以支持通过对象的方式批量传入图层属性，
      // 但是优先级低于单个传入属性，即如果单个属性有传入值，优先使用传入的值，
      // 如果没有传入，但是extensions中有该属性，则使用extensions里对应的值
      // 修改者：龚跃健 2024/10/28
      const tempProps = {
        ...this.$props,
        ...this.$props.extensions,
        ...this.$options.propsData,
      };
      Object.keys(tempProps).forEach(function (key) {
        if (key === "extensions") {
          return;
        }
        options[key] = tempProps[key];
      });
      return options;
    },
    /**
     * @description 初始化组件
     */
    mount() {
      const vm = this;
      const { viewer, vueIndex, vueKey, vueCesium, $props } = this;
      const { url, opacity } = this;
      const { luminanceAtZenith, maximumMemoryUsage } = this;
      if (viewer.isDestroyed()) return;
      const options = this.getOptions();
      const tilesetLayer = new zondy.layer.Cesium3DTilesCacheLayer({
        // 服务基地址
        url,
        ...options,
      });
      const cesiumOptions = initializeOptions(tilesetLayer, viewer);
      zondy.cesium.Cesium3DTileset.fromUrl(url, cesiumOptions).then(
        (tileset) => {
          if (!tileset) {
            return;
          }
          tileset.imageBasedLighting.luminanceAtZenith = luminanceAtZenith;
          tileset.cacheBytes = maximumMemoryUsage;
          if (options.autoReset) {
            const boundingSphere = tileset.boundingSphere;
            const orientation = new Cesium.HeadingPitchRange(
              0.0,
              -0.5,
              boundingSphere.radius * 2.5
            );
            viewer.camera.flyToBoundingSphere(boundingSphere, {
              duration: 0,
              offset: orientation,
            });
          }
          viewer.scene.primitives.add(tileset);
          tileset.style = new Cesium.Cesium3DTileStyle({
            color: `color('#FFFFFF', ${opacity})`,
          });
          vueCesium.Tileset3DManager.addSource(vueKey, vueIndex, tileset, {
            url: url,
          });
          vm.$emit("loaded", { tileset: tileset, m3ds: [tileset] });
          vm.bindPopupEvent();
        }
      );
    },
    /**
     * @description 清空组件
     */
    unmount() {
      const { viewer, vueKey, vueIndex, vueCesium } = this;
      this.removeLayer();
      this.feature = null;
      this.unbindPopupEvent();
      this.$emit("unload");
      vueCesium.Tileset3DManager.deleteSource(vueKey, vueIndex);
    },
    /**
     * @description 移除3DTiles图层
     */
    removeLayer() {
      const { viewer } = this;
      const tileset = this.getTileSet();
      if (tileset) {
        viewer.scene.primitives.remove(tileset);
      }
    },
    /**
     * @description 获取TileSet
     */
    getTileSet() {
      const { vueKey, vueIndex } = this;
      const find = vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find) {
        let tileset = find.source;
        if (tileset) {
          return tileset;
        }
        return null;
      }
      return null;
    },
    /**
     * @description 绑定气泡框事件
     */
    bindPopupEvent() {
      const { vueKey, vueIndex, vueCesium } = this;
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
      vueCesium.Tileset3DManager.changeOptions(
        vueKey,
        vueIndex,
        "clickhandler",
        clickhandler
      );
      vueCesium.Tileset3DManager.changeOptions(
        vueKey,
        vueIndex,
        "hoverhandler",
        hoverhandler
      );
    },
    /**
     * @description 取消绑定气泡框事件
     */
    unbindPopupEvent() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
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
      this.cancelFeature();
    },
    /**
     * @description 设置tileset透明度
     * @param {Number} opacity 透明度
     */
    changeOpacity(opacity) {
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const vm = this;
      const tileset = this.getTileSet();
      if (!tileset) {
        return;
      }
      tileset.style = new Cesium.Cesium3DTileStyle({
        color: `color('#FFFFFF', ${opacity})`,
      });
    },
    /**
     * @description 拾取
     * @param {Object} payload cesium鼠标点击事件返回的对象
     */
    pickFeature(payload) {
      console.log("payload: ", payload);
      const vm = this;
      const { movement } = payload;

      const { popupOptions, highlightStyle, vueKey, vueIndex } = this;
      const { viewer, Cesium } = this;
      const { version } = this;
      const { popupShowType } = this;

      const pickInfo = {};

      const tileset = this.getTileSet();
      if (!tileset) {
        return;
      }

      let feature = viewer.scene.pick(movement.position);

      this.cancelFeature(false);

      if (
        feature instanceof Cesium.Cesium3DTileFeature &&
        feature.content.tileset === tileset
      ) {
        if (feature) {
          this.feature = feature;
        }
        feature.color = Cesium.Color.fromCssColorString(highlightStyle);

        let properties;
        const propertyIds = feature.getPropertyIds();
        // 修改说明：属性信息也统一从feature上获取，更新获取方法
        // 修改人:龚跃健
        // 修改日期：2025-1-9
        if (propertyIds && propertyIds.length) {
          for (let i = 0; i < propertyIds.length; ++i) {
            const propertyId = propertyIds[i];
            properties[propertyId] = feature.getProperty(propertyId);
          }
        }

        if (popupShowType === "default") {
          vm.featureproperties = properties;
        } else {
          vm.popupOverlay &&
            vm.popupOverlay.setContent(properties ? properties : null);
        }
        pickInfo.properties = properties;
        pickInfo.layerId = vm.vueIndex;
        vm.$emit("pick-info", pickInfo);
      } else {
        vm.$emit("pick-info", {});
      }
    },
    /**
     * @description 取消拾取内容
     */
    cancelFeature(sendPickInfo = true) {
      if (this.feature) {
        const { Cesium } = this;
        this.feature.color = new Cesium.Color();
        this.feature = null;
        this.featureposition = undefined;
        this.featureproperties = undefined;

        if (this.popupShowType === "right") {
          this.popupOverlay && this.popupOverlay.setContent(null);
        }
      }
      sendPickInfo && this.$emit("pick-info", {});
    },
  },
  render(createElement) {
    return createElement("span");
  },
};
</script>
