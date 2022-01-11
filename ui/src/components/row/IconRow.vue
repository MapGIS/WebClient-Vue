<template>
  <div>
    <mapgis-ui-row class="mapgis-ui-icon-row-container" :style="mainStyle">
      <img class="mapgis-ui-icon-row-img"
           :style="iconStyle"
           :src="src"
           :title="imgTitle" alt="">
      {{ title }}
      <mapgis-ui-more-tool-button @click="$_clickTool" :dataSource="moreTools" class="mapgis-ui-icon-row-more-tool"/>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-icon-row",
  props: {
    title: {
      type: String
    },
    //传图的图标url或base64
    src: {
      type: String
    },
    //图片悬停说明
    imgTitle: {
      type: String
    },
    mainStyle: {
      type: Object
    },
    iconStyle: {
      type: Object
    },
    moreTools: {
      type: Array,
      default() {
        return [{
          event: "edit",
          icon: "edit",
          title: "修改"
        }, {
          event: "delete",
          icon: "delete",
          title: "删除"
        }];
      }
    }
  },
  methods: {
    $_clickTool(type) {
      this.$emit("clickTool", type);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-icon-row-container {
  text-align: left;
  font-size: 17px;
  cursor: pointer;
}

.mapgis-ui-icon-row-more-tool {
  position: absolute;
  right: 0;
  top: 0;
}

.mapgis-ui-icon-row-img {
  width: 16px;
  height: 16px;
}
</style>