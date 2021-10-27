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
    <div class="mapgis-3d-m3d-menus-content">
      <m3d-menu-highlight
        v-if="currentMenu == 'highlight'"
        :version="version"
        :layerIndex="layerIndex"
      >
      </m3d-menu-highlight>
      <m3d-menu-oid
        v-if="currentMenu == 'oid'"
        :version="version"
        :layerIndex="layerIndex"
      >
      </m3d-menu-oid>
      <m3d-menu-props
        v-if="currentMenu == 'properties'"
        :version="version"
        :layerIndex="layerIndex"
        :gdbp="gdbp"
        :ip="ip"
        :port="port"
      >
      </m3d-menu-props>
      <m3d-menu-effect
        v-if="currentMenu == 'effect'"
        :version="version"
        :layerIndex="layerIndex"
      >
      </m3d-menu-effect>
    </div>
  </div>
</template>

<script>
import M3dMenuHighlight from "./M3dMenuHighlight.vue";
import M3dMenuOid from "./M3dMenuOid.vue";
import M3dMenuProps from "./M3dMenuProps.vue";
import M3dMenuEffect from "./M3dMenuEffect.vue";

export default {
  name: "mapgis-3d-m3d-menus",
  components: { M3dMenuHighlight, M3dMenuOid, M3dMenuProps, M3dMenuEffect },
  props: {
    version: {
      type: String
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
          type: "oid",
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
