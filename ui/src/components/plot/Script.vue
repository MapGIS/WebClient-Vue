<template>
  <div>
    <div class="plot-script-panel">
      <mapgis-ui-group-tab
        title="<< 返回脚本列表"
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
    </div>
    <mapgis-ui-plot-animation
      :animation="scriptCopy.animations[activeIndex]"
      :attrsItemOptions="attrsItemOptions"
      @change="animationChange"
      v-if="activeIndex !== undefined"
    ></mapgis-ui-plot-animation>
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
    attrsItemOptions: {
      type: Array,
      default: () => {
        return [
          "compareLineColor",
          "wallColor",
          "wallGradColor",
          "strokeStyle",
          "fillGradColor",
          "fillStyle",
          "compareLineWidth",
          "dimModHeight",
          "lineWidth"
        ];
      }
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
    // scriptCopy: {
    //   handler: function(obj) {
    //     this.$emit("change", obj);
    //     console.log("scriptchange", obj);
    //   },
    //   deep: true,
    //   immediate: true
    // }
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
        none: "无动画",
        "scale-animation": "比例动画",
        "attribute-animation": "属性动画",
        "visible-animation": "显隐动画",
        "blink-animation": "闪烁动画",
        "grow-animation": "生长动画",
        "path-animation": "路径动画"
      }
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
      this.$emit("edit");
    },
    editScriptName() {
      this.scriptCopy.timeLineName = this.nameToEdit;
      this.editState = false;
      this.$emit("change", this.scriptCopy);
    },
    editAnimation(index) {
      this.activeIndex = index;
    },
    addAnimation(type) {
      const vm = this;
      // console.log("add",type);
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
      let event = 'animationChange';
      let length = Object.keys(this.scriptCopy.animations[vm.activeIndex]).length;
      if(length == 3){
        event = 'add';
      }
      this.scriptCopy.animations[vm.activeIndex] = e;
      this.$emit(event, { index: this.activeIndex, script: this.scriptCopy });
      // console.log(
      //   "change-----script",event,
      //   this.scriptCopy.animations[vm.activeIndex]
      // );
    },
    showScriptList() {
      this.$emit("return", true);
    }
  }
};
</script>
