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
    v-if="popupShowType === 'default' && featureposition"
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
      featureproperties: undefined
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
      const tileset = viewer.scene.layers.getCesium3DTilesetLayer(
        this.layerIndex
      );
      tileset.show = next;
    }
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        resolve => {
          const { $props, url, token } = this;
          const { headers } = $props;
          let layerIndex;
          const options = this.getOptions();
          options.loaded = this.onTilesetLoaded;
          let urlSource;
          if (headers) {
            urlSource = new Cesium.Resource({ url: url, headers: headers });
          } else if (token && token.value) {
            urlSource = url + "?" + token.key + "=" + token.value;
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
        reject => {}
      );
      // let options = { ...$props, url: urlSource };
      // const tileset = new Cesium.Cesium3DTileset(options);
    },
    getOptions() {
      const { $props } = this;
      let options = {};
      Object.keys($props).forEach(function(key) {
        options[key] = $props[key];
      });
      return options;
    },
    changeOpacity(opacity) {
      const { vueKey, vueIndex } = this;
      const vm = this;
      let find = vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find) {
        let tileset = find.source;
        if (!tileset) return;

        tileset.style = new Cesium.Cesium3DTileStyle({
          color: `color('#FFFFFF', ${opacity})`
        });
      }
    },
    onTilesetLoaded(tileset) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, url } = this;
      if (tileset) {
        let tilesetLayer = [tileset];
        vueCesium.Tileset3DManager.addSource(vueKey, vueIndex, tileset, {
          url: url
        });
        vm.$emit("loaded", { tileset: tileset, m3d: tilesetLayer });
        vm.bindPopupEvent();
      }
    },
    pickFeature(payload) {
      const vm = this;
      const { movement } = payload;

      const { popupOptions, highlightStyle, vueKey, vueIndex } = this;
      // const { color = "rgba(255, 255, 0, 0.6)" } = highlightStyle;
      const { viewer } = this;
      const { version, layerIndex } = this;

      const tileset = viewer.scene.layers.getCesium3DTilesetLayer(layerIndex);

      let feature = viewer.scene.pick(movement.position);

      this.cancelFeature();
      if (feature.tileset !== tileset) {
        // 拾取非当前tileset时不进行关闭，让高亮和气泡框展示
        // vm.iClickFeatures = [];
        // vm.iClickPosition = {};
        return;
      } else {
        vm.featureposition = vm.iClickPosition;
      }
      if (feature) {
        this.feature = feature;
      }

      feature.color = Cesium.Color.fromCssColorString(highlightStyle);

      if (this.popupShowType === "default") {
        const propertyNames = feature.getPropertyNames();
        if (propertyNames && propertyNames.length > 0) {
          const properties = {};
          propertyNames.forEach(item => {
            properties[item] = feature.getProperty(item);
          });
          vm.featureproperties = properties;
          // vm.iClickFeatures = [{ properties: properties }];
        } else {
          // vm.iClickFeatures = [];
          vm.featureproperties = undefined;
        }
      }
    },
    cancelFeature() {
      if (this.feature) {
        this.feature.color = new Cesium.Color();
        this.feature = null;
        this.featureposition = undefined;
        this.featureproperties = undefined;
      }
    }
  }
};
</script>
