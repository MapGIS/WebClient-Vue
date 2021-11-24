<template>
  <div>
    <panel-one
        ref="panel"
        @chooseTool="$_chooseTool"
    />
    <edit-panel
        :show="showEditPanel"
        :editOptions="toolOptions"
    />
  </div>
</template>

<script>
import PanelOne from "./PanelOne"
import EditPanel from "./EditPanel"
import editOptions from "./panelOptions";
import DrawPlotting from "./DrawPlotting";
import DrawModeEnum from "./drawModeEnum";

export default {
  name: "mapgis-3d-plotting-layer",
  components: {
    "panel-one": PanelOne,
    "edit-panel": EditPanel,
  },
  mixins: [DrawPlotting],
  data() {
    return {
      editOptions: editOptions,
      toolOptions: undefined,
      showEditPanel: false,
      mapgisPlottingeDrawStyle: undefined,
      entityId: undefined
    }
  },
  watch: {
    toolOptions: {
      handler: function () {
        if (this.drawMode && this.drawMode !== DrawModeEnum.UnPicked) {
          if (this.drawMode === DrawModeEnum.Picked || this.drawMode === DrawModeEnum.Added) {
            let style = this.$_getStyleFromOptions(this.toolOptions.options);
            let handlerManager = window.vueCesium.DrawToolManager.findSource(this.vueKey, this.vueIndex);
            let options = handlerManager.options;
            for (let i = 0; i < options.length; i++) {
              if (this.entityId === options[i].id) {
                console.log("更新数据", style)
                this.updateEntityStyle(options[i], style);
                break;
              }
            }
          } else {
            this.mapgisPlottingeDrawStyle = this.$_getStyleFromOptions(this.toolOptions.options);
          }
        }
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    $_getStyleFromOptions(options) {
      let style = {};
      for (let i = 0; i < options.length; i++) {
        style[options[i].key] = options[i].value;
      }
      return style;
    },
    $_chooseTool(tool) {
      let vm = this;
      //开启编辑面板
      this.showEditPanel = true;
      this.toolOptions = this.editOptions[tool];
      //调用绘制方法
      let chars = [...tool];
      chars[0] = chars[0].toUpperCase();
      let upToolName = chars.join("");
      this.mapgisPlottingeDrawStyle = this.$_getStyleFromOptions(this.toolOptions.options);
      this["draw" + upToolName](this.style, function (drawMode, entity) {
        if (drawMode === DrawModeEnum.Added) {
          //已经添加entity，仅绘制一次，取消工具栏选中状态
          vm.$refs.panel.activeTool = undefined;
          vm.entityId = entity.id;
        } else if (drawMode === DrawModeEnum.UnPicked) {
          //未点击任何entity，隐藏编辑面板
          vm.showEditPanel = false;
        } else if (drawMode === DrawModeEnum.Picked) {
          //点击摸一个entity，显示编辑面板
          vm.showEditPanel = true;
          vm.toolOptions = entity.id.extraOptions;
          vm.entityId = entity.id.id;
        }
      }, this.toolOptions, true);
    }
  }
}
</script>

<style scoped>

</style>