<template>
  <div class="mapgis-layercontent-studio">
    <contextmenu-item @click="handleClick('edit')">
      <mapgis-ui-iconfont type="mapgis-edit" />编辑显示样式
    </contextmenu-item>
    <contextmenu-item divider />
    <contextmenu-item
      @click="handleClick('add-theme')"
      v-if="!isTheme && !isSymbol"
    >
      <mapgis-ui-iconfont type="mapgis-barchart" />创建专题图
    </contextmenu-item>
    <contextmenu-item
      @click="handleClick('edit-theme')"
      v-if="isTheme && !isSymbol"
    >
      <mapgis-ui-iconfont type="mapgis-barchart" />编辑专题图
    </contextmenu-item>
    <contextmenu-item
      @click="handleClick('remove-theme')"
      v-if="isTheme && !isSymbol"
    >
      <mapgis-ui-iconfont type="mapgis-redo" />撤销专题图
    </contextmenu-item>
    <contextmenu-item
      @click="handleClick('make-symbol')"
      v-if="!isTheme && !isSymbol"
    >
      <mapgis-ui-iconfont type="mapgis-translate" />生成注记
    </contextmenu-item>
    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('open-table')">
      <mapgis-ui-iconfont type="mapgis-table" />查看属性表
    </contextmenu-item>
    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('scale')">
      <mapgis-ui-iconfont type="mapgis-eye-close" /> 显示级别控制
    </contextmenu-item>

    <contextmenu-item divider />
    <contextmenu-item @click="handleClick('up')">
      <mapgis-ui-iconfont type="mapgis-arrowup" />上移
    </contextmenu-item>
    <contextmenu-item @click="handleClick('down')">
      <mapgis-ui-iconfont type="mapgis-arrowdown" />下移
    </contextmenu-item>

    <contextmenu-submenu>
      <span slot="title">
        <mapgis-ui-iconfont type="mapgis-interation" />重命名
      </span>
      <contextmenu-item :autoHide="false">
        <mapgis-ui-input
          :style="{ width: '200px' }"
          :value="layerTitle"
          @change="handleNameChange"
        />
        <mapgis-ui-button type="primary" @click="handleRename"
          >确认
        </mapgis-ui-button>
      </contextmenu-item>
    </contextmenu-submenu>
    <contextmenu-item divider />
    <contextmenu-item @click="emitDeleteClick">
      <mapgis-ui-iconfont type="mapgis-close" /> 移除
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
    // eslint-disable-next-line vue/no-unused-components
    ContextmenuGroup,
    ContextmenuSubmenu
  },
  props: {
    layerId: { type: String },
    isTheme: { type: Boolean, default: false },
    isSymbol: { type: Boolean, default: false }
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
    handleNameChange(event) {
      let name = event.target.value;
      this.layerTitle = name;
    },
    handleRename() {
      let { layerId, layerTitle } = this;
      this.$emit("onRename", { id: layerId, name: layerTitle });
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
          break;
        case "edit-theme":
          this.$emit("onEditTheme", { type, layerId });
          emitMapEditThemeLayer({ type, layerId });
          break;
        case "remove-theme":
          this.$emit("onRemoveTheme", { type, layerId });
          emitMapRemoveThemeLayer({ type, layerId });
          break;
        case "make-symbol":
          this.$emit("onMakeSymbol", { type, layerId });
          console.log("send-make-symbol");
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

.mapgis-layercontent-studio .anticon {
  font-size: 16px;
  line-height: 16px;
  margin-right: 6px;
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
