<template>
  <div class="plot-script-panel">
    <mapgis-ui-group-tab
      title="<< 返回脚本列表并保存更新"
      :isTitleBold="false"
      size="small"
      @click.native="showScriptList"
    >
    </mapgis-ui-group-tab>
    <mapgis-ui-divider />
    <mapgis-ui-group-tab
      :title="scriptCopy.timeLineName"
      :isTitleBold="false"
      class="plot-script-panel-header"
      v-if="!editState"
    >
      <mapgis-ui-space :size="16" slot="handle">
        <mapgis-ui-iconfont
          type="mapgis-play-circle-fill"
          class="icon-lg"
          @click.native="playScript"
        />
        <mapgis-ui-iconfont
          type="mapgis-bianji"
          class="icon"
          @click.native="editScript"
        />
      </mapgis-ui-space>
    </mapgis-ui-group-tab>
    <mapgis-ui-group-tab class="script-title-edit" v-else>
      <mapgis-ui-input v-model="nameToEdit" size="small" slot="title" />
      <mapgis-ui-space :size="16" slot="handle">
        <mapgis-ui-iconfont type="mapgis-check" @click="editScriptName" />
        <mapgis-ui-iconfont
          type="mapgis-close"
          @click="() => (editState = false)"
        />
      </mapgis-ui-space>
    </mapgis-ui-group-tab>

    <mapgis-ui-list
      class="plot-script-panel-content"
      item-layout="horizontal"
      size="small"
      :data-source="scriptCopy.animations"
      :split="false"
    >
      <mapgis-ui-list-item
        :class="{ 'list-active': activeIndex === index }"
        :key="index"
        slot="renderItem"
        slot-scope="item, index"
        @click="editAnimation(index)"
      >
        <div class="list-item">{{ item.animationName }}</div>
      </mapgis-ui-list-item>
    </mapgis-ui-list>

    <mapgis-ui-dropdown :trigger="['click']">
      <mapgis-ui-group-tab
        title="添加动画"
        :isTitleBold="false"
        :hasTopMargin="false"
        class="plot-script-panel-footer"
      >
        <div slot="front" class="front">
          <img src="./style/images/u77.svg" class="icon" />
        </div>
      </mapgis-ui-group-tab>

      <template #overlay>
        <mapgis-ui-menu>
          <mapgis-ui-menu-item
            v-for="(value, key, index) in defaultAnimation"
            :key="index"
            @click="addAnimation(key)"
          >
            {{ value }}
          </mapgis-ui-menu-item>
        </mapgis-ui-menu>
      </template>
    </mapgis-ui-dropdown>
    <mapgis-ui-divider v-if="activeIndex !== undefined" />
    <mapgis-ui-plot-animation
      :animation="scriptCopy.animations[activeIndex]"
      :attrsItemOptions="attrsItemOptionsUsed"
      :attrsItemColorOptions="attrsItemColorOptionsUsed"
      :idsOptions="idsOptions"
      :animationOptions="defaultAnimation"
      @change="animationChange"
      @drawPath="initDrawer"
      v-if="activeIndex !== undefined"
    ></mapgis-ui-plot-animation>
    <mapgis-draw
      v-if="!is3dLayer"
      :enableControl="false"
      ref="draw"
      @drawCreate="getCoods"
    />
    <mapgis-3d-draw
      v-if="is3dLayer"
      :enableControl="false"
      :infinite="false"
      ref="draw"
      @drawCreate="getCoods"
    />
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-plot-script",
  props: {
    script: {
      type: Object,
      required: true
    },
    plotId: {
      type: String
    },
    // 属性动画中属性名称的选项
    attrsItemOptions: {
      type: Array,
      default: () => {
        return [
          "compareLineColor",
          "wallColor",
          // "wallGradColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle",
          "compareLineWidth",
          "dimModHeight",
          "lineWidth"
        ];
      }
    },
    attrsItemColorOptions: {
      type: Array,
      default: () => {
        return [
          "compareLineColor",
          "wallColor",
          // "wallGradColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle"
        ];
      }
    },
    /**
     * 标绘图层的vueKey
     */
    vueKey: {
      type: String
    },
    /**
     * 标绘图层的vueIndex
     */
    vueIndex: {
      type: [Number, String]
    },
    is3dLayer: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    script: {
      handler: function(obj) {
        this.scriptCopy = obj;
      },
      deep: true,
      immediate: true
    },
    activeIndex(index) {
      if (index) {
        this.getIdsOptions(this.scriptCopy.animations[index].featureIds);
      }
    }
  },
  created() {
    this.scriptCopy = this.script;
  },
  data() {
    return {
      scriptCopy: undefined,
      activeIndex: undefined,
      editState: false,
      nameToEdit: "",
      defaultAnimation: {
        "scale-animation": "比例动画",
        "attribute-animation": "属性动画",
        "visible-animation": "显隐动画",
        "blink-animation": "闪烁动画",
        "grow-animation": "生长动画",
        "path-animation": "路径动画"
      },
      // 图元的部件名称
      idsOptions: undefined,
      // 属性动画中属性名称的选项
      attrsItemOptionsUsed: undefined,
      attrsItemColorOptionsUsed: undefined
    };
  },
  methods: {
    playScript() {
      this.editState = false;
      this.$emit("play");
    },
    editScript() {
      this.nameToEdit = this.scriptCopy.timeLineName;
      this.editState = true;
      // this.$emit("edit");
    },
    editScriptName() {
      this.scriptCopy.timeLineName = this.nameToEdit;
      this.editState = false;
    },
    editAnimation(index) {
      this.activeIndex = index;
    },
    addAnimation(type) {
      const vm = this;
      if (!vm.plotId) {
        this.$message.warning("没有选中动画绑定的图元对象！");
        return;
      }
      let plot = this.getPlot(vm.plotId);
      if (type == "grow-animation" && plot._elem.type.indexOf("point") > -1) {
        // 点类型无法添加生长动画
        this.$message.warning("点类型的图元不能设置生长动画！");
        return;
      }

      this.getIdsOptions(this.plotId);
      let animation = {
        animationName: "动画" + (vm.scriptCopy.animations.length + 1),
        animationType: type,
        featureIds: vm.plotId
      };
      this.scriptCopy.animations.push(animation);
      this.activeIndex = this.scriptCopy.animations.length - 1;

      // this.$emit("add", { index: this.activeIndex, script: this.scriptCopy });
    },
    animationChange(e) {
      const vm = this;
      let event = "animationChange";
      let length = Object.keys(this.scriptCopy.animations[vm.activeIndex])
        .length;
      // 判断动画的改变是否为新增动画
      if (length == 3) {
        event = "add";
      }
      this.scriptCopy.animations[vm.activeIndex] = e;
      this.$emit(event, { index: this.activeIndex, script: this.scriptCopy });
    },
    showScriptList() {
      this.$emit("return", true,this.scriptCopy);
    },
    getIdsOptions(id) {
      let plot = this.getPlot(id);
      let json = plot.getStyle();
      // 没有开启墙体时，属性动画中属性名称不显示墙体颜色的选项,反之显示
      this.attrsItemColorOptionsUsed = this.attrsItemColorOptions.filter(
        item => {
          if (item === "wallColor") return json.isOpenWall ? true : false;
          return true;
        }
      );
      this.attrsItemOptionsUsed = this.attrsItemOptions.filter(item => {
        if (item === "wallColor") return json.isOpenWall ? true : false;
        return true;
      });
      this.idsOptions = Object.keys(json.nodeStyles);
    },
    getPlot(id) {
      let layerManager;
      if (this.is3dLayer) {
        layerManager = window.vueCesium.PlotLayerManager.findSource(
          this.vueKey,
          this.vueIndex
        );
      } else {
        layerManager = window.vueMap.PlotLayerManager.findSource(
          this.vueKey,
          this.vueIndex
        );
      }
      let layer = layerManager && layerManager.source;
      if (!layer) return;
      return layer.getPlotByID(id);
    },
    initDrawer() {
      this.is3dLayer
        ? this.$refs.draw.enableDrawLine()
        : this.$refs.draw.togglePolyline();
    },
    getCoods(a, b) {
      let coords;
      if (this.is3dLayer) {
        coords = b.map(pos => {
          return pos.slice(0, 2);
        });
        this.$refs.draw.removeEntities(true);
      } else {
        coords = a.features[0].geometry.coordinates;
        this.$refs.draw.toggleDeleteAll();
      }
      this.scriptCopy.animations[this.activeIndex].animationCoords = coords;
    }
  }
};
</script>
