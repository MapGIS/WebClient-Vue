<template>
  <div class="mapgis-layercontent-studio">
    <contextmenu-item @click="handleClick('edit')">
      <mapgis-ui-iconfont type="mapgis-yangshikuguanli" />编辑显示样式
    </contextmenu-item>
    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('add-theme')" v-if="!isTheme">
      <mapgis-ui-iconfont type="mapgis-zhuantitu" />创建专题图
    </contextmenu-item>
    <contextmenu-item @click="handleClick('edit-theme')" v-if="isTheme">
      <mapgis-ui-iconfont type="mapgis-zhuantitu" />编辑专题图
    </contextmenu-item>
    <contextmenu-item @click="handleClick('remove-theme')" v-if="isTheme">
      <mapgis-ui-iconfont type="mapgis-chexiao" />撤销专题图
    </contextmenu-item>
    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('open-table')">
      <mapgis-ui-iconfont type="mapgis-zhujishuxingbianji" />查看属性表
    </contextmenu-item>
    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('scale')">
      <mapgis-ui-iconfont type="mapgis-yincangxianshimian" /> 显示级别控制
    </contextmenu-item>

    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('up')">
      <mapgis-ui-iconfont type="mapgis-yidong1" />上移
    </contextmenu-item>
    <contextmenu-item @click="handleClick('down')">
      <mapgis-ui-iconfont type="mapgis-yidong1" />下移
    </contextmenu-item>

    <contextmenu-submenu>
      <span slot="title">
        <mapgis-ui-iconfont type="mapgis-zaodanhangzhuji" />重命名
      </span>
      <contextmenu-item :autoHide="false">
        <mapgis-ui-input
          :style="{ width: '200px' }"
          :value="layerTitle"
          @change="handleRename"
        />
      </contextmenu-item>
    </contextmenu-submenu>
    <contextmenu-item divider />
    <contextmenu-item @click="emitDeleteClick">
      <mapgis-ui-iconfont type="mapgis-shanchudangqianziceng" /> 移除
    </contextmenu-item>
  </div>
</template>
<script>
import {
  emitMapAddThemeLayer,
  emitMapEditThemeLayer,
  emitMapRemoveThemeLayer,
  emitMapOpenTable
} from "../../../../lib/eventbus/EmitMap";
import {
  ContextmenuItem,
  ContextmenuGroup,
  ContextmenuSubmenu
} from "v-contextmenu";
export default {
  name: "mapgis-layercontent-studio",
  components: {
    ContextmenuItem,
    ContextmenuGroup,
    ContextmenuSubmenu
  },
  props: {
    layerId: { type: String },
    isTheme: { type: Boolean, default: false }
  },
  watch: {
    layerId(next) {
      this.layerTitle = next;
    }
  },
  data() {
    return {
      reverse: true,
      layerTitle: this.layerId
    };
  },
  methods: {
    emitReveseClick() {
      const { layerId } = this;
      if (layerId) {
        this.$emit("onReverse", { layerId });
      }
    },
    emitDeleteClick() {
      const { layerId } = this;
      if (layerId) {
        this.$emit("onDelete", { layerId });
      }
    },
    handleRename(event) {
      let name = event.target.value;
      let { layerId } = this;
      this.$emit("onRename", { id: layerId, name });
    },
    handleClick(type) {
      const { layerId } = this;
      switch (type) {
        case "edit":
          this.$emit("onEdit", { type, layerId });
          break;
        case "scale":
          this.$emit("onScale", { type, layerId });
          break;
        case "add-theme":
          this.$emit("onAddTheme", { type, layerId });
          emitMapAddThemeLayer({ type, layerId });
          break;
        case "edit-theme":
          this.$emit("onEditTheme", { type, layerId });
          emitMapEditThemeLayer({ type, layerId });
          break;
        case "remove-theme":
          this.$emit("onRemoveTheme", { type, layerId });
          emitMapRemoveThemeLayer({ type, layerId });
          break;
        case "open-table":
          this.$emit("onOpenTable", { type, layerId });
          emitMapOpenTable({ type, layerId });
          break;
        case "up":
          this.$emit("onUp", { type, layerId });
          break;
        case "down":
          this.$emit("onDown", { type, layerId });
          break;
      }
    }
  }
};
</script>

<style>
.mapgis-layercontent-studio .mapgis-iconfont-wrapper {
  width: 1.25em;
  height: 1.25em;
  margin-right: 12px;
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
.v-contextmenu .v-contextmenu-item {
  padding: 8px 10px !important;
  line-height: 1;
  color: #333;
}
</style>
