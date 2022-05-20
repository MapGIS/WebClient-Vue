<template>
  <div>
    <div class="plot-script-panel">
      <mapgis-ui-group-tab
        :title="nameCopy"
        :isTitleBold="false"
        class="plot-script-panel-header"
        v-if="!editState"
      >
        <mapgis-ui-space :size="16" slot="handle">
          <!-- <img src="./style/images/u40.svg" class="icon"/> -->
          <img
            src="./style/images/u372.svg"
            class="icon-lg"
            @click="playScript"
          />
          <img src="./style/images/u128.svg" class="icon" @click="editScript" />
          <!-- <img src="./style/images/u127.svg" class="icon"/> -->
        </mapgis-ui-space>
      </mapgis-ui-group-tab>
      <mapgis-ui-group-tab 
        class="script-title-edit"
        v-else 
      >
        <mapgis-ui-input v-model="nameToEdit" size="small" slot="title" />
        <mapgis-ui-space :size="16" slot="handle">
          <mapgis-ui-iconfont
            type="mapgis-check"
            @click="
              () => {
                nameCopy = nameToEdit;
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
        :data-source="animationListCopy"
        :split="false"
      >
        <mapgis-ui-list-item
          :class="{ 'list-active': activeIndex === index }"
          :key="index"
          slot="renderItem"
          slot-scope="item, index"
          @click="editAnimation(index)"
        >
          <div class="list-item">{{ item.name }}</div>
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
              {{ key }}
            </mapgis-ui-menu-item>
          </mapgis-ui-menu>
        </template>
      </mapgis-ui-dropdown>
    </div>
    <!-- <mapgis-ui-divider></mapgis-ui-divider> -->
    <mapgis-ui-plot-animation
      :animationList="defaultAnimation"
      v-model="animationListCopy[activeIndex].animation"
      v-if="activeIndex !== undefined"
    ></mapgis-ui-plot-animation>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-plot-script",
  props: {
    name: {
      type: String,
      default: "脚本"
    },
    animationList: {
      type: Array
    },
    defaultAnimation: {
      type: Object
    }
  },
  watch: {
    animationList: {
      handler: function(arr) {
        this.animationListCopy = arr;
      },
      deep: true,
      immediate: true
    },
    animationListCopy: {
      handler: function(arr) {
        console.log(arr);
        this.$emit("change", arr);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.animationListCopy = this.animationList;
  },
  data() {
    return {
      nameCopy: this.name,
      animationListCopy: this.animationList,
      activeIndex: undefined,
      editState: false,
      nameToEdit: this.nameCopy
    };
  },
  methods: {
    playScript() {
      this.editState = false;
      this.$emit("play");
    },
    editScript() {
      this.nameToEdit = this.nameCopy;
      this.editState = true;
      this.$emit("edit");
    },
    editAnimation(index) {
      this.activeIndex = index;
    },
    addAnimation(animationType) {
      const vm = this;
      // console.log("add",animationType);
      this.animationListCopy.push({
        name: "动画" + (vm.animationListCopy.length + 1),
        animation: { [animationType]: vm.defaultAnimation[animationType] }
      });
      this.activeIndex = vm.animationListCopy.length - 1;
    }
  }
};
</script>
