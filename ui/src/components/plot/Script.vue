<template>
  <div>
    <div class="plot-script-panel">
      <mapgis-ui-group-tab
        title="<< 返回脚本列表"
        :isTitleBold="false"
        size="small"
      >
      </mapgis-ui-group-tab>
      <mapgis-ui-divider />
      <mapgis-ui-group-tab
        :title="animationListCopy.timeLineName || '脚本名称'"
        :isTitleBold="false"
        class="plot-script-panel-header"
        v-if="!editState"
      >
        <mapgis-ui-space :size="16" slot="handle">
          <mapgis-ui-iconfont
            type="mapgis-play-circle-fill"
            class="icon-lg"
            @click="playScript"
          />
          <mapgis-ui-iconfont
            type="mapgis-bianji"
            class="icon"
            @click="editScript"
          />
        </mapgis-ui-space>
      </mapgis-ui-group-tab>
      <mapgis-ui-group-tab class="script-title-edit" v-else>
        <mapgis-ui-input v-model="nameToEdit" size="small" slot="title" />
        <mapgis-ui-space :size="16" slot="handle">
          <mapgis-ui-iconfont
            type="mapgis-check"
            @click="
              () => {
                animationListCopy.timeLineName = nameToEdit;
                editState = false;
              }
            "
          />
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
        :data-source="animationListCopy.animations"
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
      v-model="animationListCopy.animations[activeIndex]"
      v-if="activeIndex !== undefined"
    ></mapgis-ui-plot-animation>
  </div>
</template>

<script>
import { LOG } from '../../view/clouddisk/util/fileType';
export default {
  name: "mapgis-ui-plot-script",
  props: {
    animationList: {
      type: Object,
      required: true
    }
  },
  watch: {
    animationList: {
      handler: function(obj) {
        this.animationListCopy = obj;
      },
      deep: true,
      immediate: true
    },
    // animationListCopy: {
    //   handler: function(obj) {
    //     this.$emit("change", obj);
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    this.animationListCopy = this.animationList;
  },
  data() {
    return {
      animationListCopy: undefined,
      activeIndex: undefined,
      editState: false,
      nameToEdit: '',
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
      this.nameToEdit = this.animationListCopy.timeLineName;
      this.editState = true;
      this.$emit("edit");
    },
    editAnimation(index) {
      console.log('11');
      
      this.activeIndex = index;
    },
    addAnimation(type) {
      const vm = this;
      console.log("add",type);
      let animation = {
        animationName: "动画" + (vm.animationListCopy.animations.length + 1),
        animationType: type
      };
      this.animationListCopy.animations.push(animation);
      this.activeIndex = this.animationListCopy.animations.length - 1;
    }
  }
};
</script>
