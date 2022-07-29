<template>
  <div class="wrapper-content-layer">
    <!--     <contextmenu-group> -->
    <!-- <contextmenu-item>
      <mapgis-ui-iconfont type="mapgis-xuanzezitu" />全选
    </contextmenu-item> -->
    <contextmenu-item @click="emitReveseClick">
      <mapgis-ui-iconfont type="mapgis-xuanzezhuji" /> 仅显示当前图层
    </contextmenu-item>
    <!-- </contextmenu-group> -->

    <contextmenu-item divider />

    <contextmenu-submenu>
      <span slot="title">
        <mapgis-ui-iconfont type="mapgis-yansehecheng" />样式编辑
      </span>
      <contextmenu-item :autoHide="false">
        <mapgis-ui-iconfont type="mapgis-bilichi" />级别控制
        <mapgis-ui-slider range v-model="zoom" :min="minzoom" :max="maxzoom" />
      </contextmenu-item>
      <contextmenu-item divider />
      <contextmenu-item :autoHide="false">
        <mapgis-ui-iconfont type="mapgis-changjingtouming" />透明度控制
        <mapgis-ui-slider :min="0" :max="1" v-model="opacity" :step="0.1" />
      </contextmenu-item>
    </contextmenu-submenu>
    <contextmenu-item divider />
    <!-- <contextmenu-item>
      <mapgis-ui-iconfont type="mapgis-dilishujuyuan" />元数据信息
    </contextmenu-item> -->

    <contextmenu-item>
      <mapgis-ui-iconfont type="mapgis-chexiao" />关闭
    </contextmenu-item>
  </div>
</template>
<script>
import {
  ContextmenuItem,
  ContextmenuSubmenu
} from "v-contextmenu";
export default {
  name: "LayerMenu",
  components: {
    ContextmenuItem,
    ContextmenuSubmenu
  },
  inject: ["leaflet", "map", "document"],
  props: {
    layerId: { type: String }
  },
  watch: {
    layerId(next) {
      this.resetLayerInfo(next);
    },
    zoom(next) {
      this.resetLayerZoom(next);
    },
    opacity(next) {
      this.resetLayerOpacity(next);
    }
  },
  data() {
    return {
      reverse: true,
      minzoom: 0,
      maxzoom: 24,
      zoom: [0, 24],
      opacity: 1.0
    };
  },
  methods: {
    emitReveseClick() {
      const { layerId } = this;
      this.$emit("reverse", { layerId });
    },
    resetLayerInfo(layerId) {
      let { document } = this;
      layerId = layerId || this.layerId;
      if (!document) return;
      const layer = document.getLayerMapInfo(layerId);
      let { minzoom, maxzoom } = layer;
      minzoom = minzoom || 0;
      maxzoom = maxzoom || 24;
      this.zoom = [minzoom, maxzoom];
    },
    resetLayerZoom(zoom) {
      const { map, layerId } = this;
      zoom = zoom || this.zoom;
      if (map && map.getLayer(layerId)) {
        map.setLayerZoomRange(layerId, zoom[0], zoom[1]);
      }
    },
    resetLayerOpacity(opacity) {
      const { map, layerId } = this;
      opacity = opacity || this.opacity;
      if (map) {
        let layer = map.getLayer(layerId);
        map.setPaintProperty(layerId, `${layer.type}-opacity`, opacity);
      }
    }
  }
};
</script>

<style>
.wrapper-content-layer {
}
/*右键菜单*/
.wrapper-content-layer .icon {
  width: 1.25em;
  height: 1.25em;
  margin-right: 4px;
  vertical-align: -0.25em;
  overflow: hidden;
  color: transparent;
}
.v-contextmenu-item--hover {
  background-color: #e8e8e8 !important;
}
.ant-tooltip {
  z-index: 9999 !important; /* 默认是1060 */
}
</style>
