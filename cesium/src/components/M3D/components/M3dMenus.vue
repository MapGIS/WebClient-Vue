<template>
  <div class="mapgis-3d-m3d-menus">
    <div class="mapgis-3d-m3d-menus-header">
      <mapgis-ui-tooltip placement="top" v-for="m in menus" :key="m.title">
        <template slot="title">
          <span>{{ m.title }}</span>
        </template>
        <mapgis-ui-iconfont
          :class="{
            'mapgis-3d-m3d-menus-header-menu': true,
            'mapgis-3d-m3d-menus-header-menu-active': currentMenu == m.type
          }"
          :type="m.icon"
          @click="() => handleMenuClick(m.type)"
        />
      </mapgis-ui-tooltip>
    </div>
    <div>
      <m3d-menu-highlight
        v-if="currentMenu == 'highlight'"
        :version="version"
        :layerIndex="layerIndex"
      >
      </m3d-menu-highlight>
    </div>
  </div>
</template>

<script>
import M3dMenuHighlight from "./M3dMenuHighlight.vue";

export default {
  name: "mapgis-3d-m3d-menus",
  components: { M3dMenuHighlight },
  props: {
    version: {
      type: String
    },
    layerIndex: {
      type: Number
    }
  },
  data() {
    return {
      currentMenu: undefined,
      currentLayerIndex: -1,
      menus: [
        {
          type: "highlight",
          title: "高亮",
          icon: "mapgis-target-lock"
        },
        {
          type: "iod",
          title: "OID查询",
          icon: "mapgis-bullseye"
        },
        {
          type: "properties",
          title: "属性查询",
          icon: "mapgis-table"
        },
        {
          type: "effect",
          title: "特效",
          icon: "mapgis-Symbols-1"
        }
      ]
    };
  },
  methods: {
    handleMenuClick(type) {
      console.log("type", type);
      this.currentMenu = type;
    }
  }
};
</script>
