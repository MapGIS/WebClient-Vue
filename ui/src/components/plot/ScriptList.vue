<template>
  <div class="plot-script-list-panel">
    <mapgis-ui-tabs
      :animated="false"
      :tabBarStyle="{ marginBottom: '8px' }"
      default-active-key="1"
    >
      <mapgis-ui-space slot="tabBarExtraContent" :size="16">
        <mapgis-ui-iconfont type="mapgis-daoru"></mapgis-ui-iconfont>
        <mapgis-ui-iconfont type="mapgis-daochu"></mapgis-ui-iconfont>
      </mapgis-ui-space>
      <mapgis-ui-tab-pane key="1" tab="脚本列表" class="control-content">
        <mapgis-ui-list
          item-layout="horizontal"
          size="small"
          :data-source="scriptListCopy"
          :split="false"
        >
          <mapgis-ui-list-item
            :class="{ 'list-active': activeIndex === index }"
            :key="index"
            slot="renderItem"
            slot-scope="item, index"
            @click="clickScript(index)"
          >
            <mapgis-ui-group-tab
              :title="item.name"
              :isTitleBold="false"
              :hasTopMargin="false"
              :hasBottomMargin="false"
              v-if="!editState"
            >
              <mapgis-ui-space :size="16" slot="handle">
                <mapgis-ui-iconfont type="mapgis-play-circle-fill" class="icon-lg" @click="play(index)"/>
                <mapgis-ui-iconfont type="mapgis-bianji" class="icon" @click="edit(index)"/>
                <mapgis-ui-iconfont type="mapgis-shanchu" class="icon" @click="remove(index)"/>
              </mapgis-ui-space>
            </mapgis-ui-group-tab>
          </mapgis-ui-list-item>
        </mapgis-ui-list>
        <mapgis-ui-group-tab
          title="添加脚本"
          :isTitleBold="false"
          :hasTopMargin="false"
          class="plot-script-list-panel-footer"
          @click="addScript"
        >
          <div slot="front" class="front">
            <img src="./style/images/u77.svg" class="icon" />
          </div>
        </mapgis-ui-group-tab>
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-plot-script-list",
  props: {
    scriptList: {
      type: Array
    }
  },
  watch: {
    scriptList: {
      handler: function(arr) {
        this.scriptListCopy = arr;
      },
      deep: true,
      immediate: true
    },
    scriptListCopy: {
      handler: function(arr) {
        console.log(arr);
        this.$emit("change", arr);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.scriptListCopy = this.scriptList;
  },
  data() {
    return {
      scriptListCopy: this.scriptList,
      activeIndex: undefined,
      editState: false,
    };
  },
  methods: {
    clickScript(index) {
      this.activeIndex = index;
      this.$emit("click", {index: index, script: this.scriptListCopy[index]});
      console.log("click", {index: index, script: this.scriptListCopy[index]});
    },
    play(index){
      this.$emit("play", {index: index, script: this.scriptListCopy[index]});
      console.log("play", {index: index, script: this.scriptListCopy[index]});
    },
    edit(index) {
      this.$emit("edit", {index: index, script: this.scriptListCopy[index]});
      console.log("edit", {index: index, script: this.scriptListCopy[index]});
    },
    remove(index){
      this.$emit("remove", {index: index, script: this.scriptListCopy[index]});
      this.scriptListCopy.splice(index,1);
      console.log("remove",this.scriptListCopy);
    },
    addScript() {
      this.$emit("addScript");
      console.log("addScript");
    }
  }
};
</script>
