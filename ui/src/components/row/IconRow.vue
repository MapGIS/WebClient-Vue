<template>
  <div>
    <mapgis-ui-row class="mapgis-ui-icon-row-container" :style="mainStyle">
      <div @dblclick="$_dbclick">
<!--        <svg v-if="enableGroup"-->
<!--             @click="$_open"-->
<!--             :style="{transform: open ? 'rotate(0deg)' : 'rotate(-90deg)'}"-->
<!--             class="mapgis-ui-icon-row-group"-->
<!--             viewBox="0 0 1024 1024" data-icon="caret-down" width="1em" height="1em" fill="currentColor"-->
<!--             aria-hidden="true" focusable="false">-->
<!--          <path-->
<!--            d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>-->
<!--        </svg>-->
        <img class="mapgis-ui-icon-row-img"
             :style="iconStyle"
             :src="src"
             :title="imgTitle" alt="">
        {{ title }}
      </div>
      <mapgis-ui-more-tool-button
        @click="$_clickTool"
        :dataSource="enableGroup ? groupTools : moreTools"
        :top="top"
        :width="width"
        class="mapgis-ui-icon-row-more-tool"/>
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
    top: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "110px"
    },
    enableGroup: {
      type: Boolean,
      default: false
    },
    moreTools: {
      type: Array,
      default() {
        return [{
          event: "edit",
          icon: "edit",
          title: "修改"
        }, {
          event: "editTitle",
          icon: "editTitle",
          title: "修改标题"
        }, {
          event: "delete",
          icon: "delete",
          title: "删除"
        }];
      }
    },
    groupTools: {
      type: Array,
      default() {
        return [{
          event: "edit",
          icon: "edit",
          title: "批量修改"
        }, {
          event: "delete",
          icon: "delete",
          title: "批量删除"
        }];
      }
    }
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    $_open() {
      this.open = !this.open;
      this.$emit("open", this.open);
    },
    $_clickTool(type) {
      this.$emit("clickTool", type);
    },
    $_dbclick() {
      this.$emit("dblclick");
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

.mapgis-ui-icon-row-group {
  width: 0.8em;
  height: 0.8em;
}
</style>