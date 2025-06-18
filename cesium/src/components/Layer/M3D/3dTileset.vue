<template>
  <!-- <mapgis-3d-virtual-popup
    v-if="popupShowType === 'default'"
    :enablePopup="enablePopup"
    :enableTips="enableTips"
    :popupOptions="popupOptions"
    :tipsOptions="tipsOptions"
    :iotOptions="iotOptions"
    :clickVisible="iClickVisible"
    :clickPosition="iClickPosition"
    :clickFeatures="iClickFeatures"
  >
  </mapgis-3d-virtual-popup> -->
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
import Tileset from "./3DTileset";
import PopupMixin from "../Mixin/PopupMixin";
export default {
  name: "mapgis-3d-3dtiles-layer",
  mixins: [Tileset, PopupMixin],
  data() {
    return {
      layerIndex: undefined,
      featureposition: undefined,
      featureproperties: undefined,
    };
  },
  watch: {
    opacity(next) {
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
    show(next) {
      const { viewer } = this;
      const tileset = viewer.scene.layers.getCesium3DTilesetLayer(
        this.layerIndex
      );
      tileset.show = next;
    },
  },
  methods: {
    createCesiumObject() {
      const { viewer, Cesium } = this;
      return new Promise(
        (resolve) => {
          const { $props, url, token } = this;
          const { headers } = $props;
          let layerIndex;
          const options = this.getOptions();
          options.loaded = this.onTilesetLoaded;
          options.errorCallback = this.onTilesetLoadedError;
          let urlSource;
          if (headers) {
            urlSource = new Cesium.Resource({ url: url, headers: headers });
          } else if (token && token.value) {
            // token等信息已拼接在url中，不需要再次处理
            // urlSource = url + "?" + token.key + "=" + token.value;
            urlSource = url;
          } else {
            urlSource = url;
          }
          layerIndex = viewer.scene.layers.appendCesium3DTilesetLayer(
            urlSource,
            options
          );
          this.layerIndex = layerIndex;
          resolve({ layerIndex });
        },
        (reject) => {}
      );
      // let options = { ...$props, url: urlSource };
      // const tileset = new Cesium.Cesium3DTileset(options);
    },
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
    changeOpacity(opacity) {
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const vm = this;
      let find = vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find) {
        let tileset = find.source;
        if (!tileset) return;

        tileset.style = new Cesium.Cesium3DTileStyle({
          color:
            "undefined === ${COLOR}.r ? color('white'," +
            opacity +
            "):rgba(${COLOR}.r *255,${COLOR}.g* 255,${COLOR}.b *255, " +
            opacity +
            ")",
        });
      }
    },
    onTilesetLoaded(tileset) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, Cesium, url, opacity } = this;
      if (tileset) {
        tileset.style = new Cesium.Cesium3DTileStyle({
          color:
            "undefined === ${COLOR}.r ? color('white'," +
            opacity +
            "):rgba(${COLOR}.r *255,${COLOR}.g* 255,${COLOR}.b *255, " +
            opacity +
            ")",
        });
        let tilesetLayer = [tileset];
        vueCesium.Tileset3DManager.addSource(vueKey, vueIndex, tileset, {
          url: url,
        });
        vm.$emit("loaded", { tileset: tileset, m3d: tilesetLayer });
        vm.bindPopupEvent();
      }
    },
    onTilesetLoadedError(info) {
      this.$emit("unLoaded");
    },
    pickFeature(payload) {
      const vm = this;
      const { movement } = payload;

      const { popupOptions, highlightStyle, vueKey, vueIndex } = this;
      // const { color = "rgba(255, 255, 0, 0.6)" } = highlightStyle;
      const { viewer, Cesium } = this;
      const { version, layerIndex } = this;
      const { popupShowType } = this;

      const pickInfo = {};

      const tileset = viewer.scene.layers.getCesium3DTilesetLayer(layerIndex);

      let feature = viewer.scene.pick(movement.position);

      this.cancelFeature(false);

      if (feature instanceof Cesium.Cesium3DTileFeature) {
        if (feature.content.tileset === tileset) {
          if (popupShowType === "default") {
            if (vm.showPopup) {
              vm.featureposition = vm.iClickPosition;
            }
            pickInfo.position = vm.iClickPosition;
          }

          if (feature) {
            this.feature = feature;
          }

          feature.color = Cesium.Color.fromCssColorString(highlightStyle);

          let properties;
          const propertyNames = feature.getPropertyNames();
          if (propertyNames && propertyNames.length > 0) {
            properties = {};
            propertyNames.forEach((item) => {
              properties[item] = feature.getProperty(item);
            });
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
        }
      } else {
        vm.$emit("pick-info", {});
      }
    },
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
};
</script>
