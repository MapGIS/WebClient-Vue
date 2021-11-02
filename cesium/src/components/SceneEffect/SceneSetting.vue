<template>
  <div>
    <mapgis-ui-div class="mapgis-3d-setting">
      <slot v-if="initial"></slot>
      <slot name="settingTool">
        <div class="mapgis-3d-setting-control" v-show="show"  :style="panelStyle">
<!--          <div @mouseenter="hover=true" @mouseleave="hover=false">-->
<!--            <img src="./components/关闭.png" class="closeButton" @click="closePanel" v-show="!hover">-->
<!--            <img src="./components/关闭hover.png" class="closeButton" @click="closePanel" v-show="hover">-->
<!--          </div>-->
          <div class="control-header">
            <label class="title">设置</label>
            <div @mouseenter="hover=true" @mouseleave="hover=false">
              <img src="./components/关闭2.png" @click="closePanel" v-show="!hover" class="closeButton2">
              <img src="./components/关闭2hover.png" @click="closePanel" v-show="hover" class="closeButton2">
            </div>
          </div>
          <mapgis-ui-tabs
              default-active-key="1"
              :animated="false"
              :tabBarStyle="tabBarStyle"
          >
            <mapgis-ui-tab-pane key="1" tab="基本属性">
              <scene-attribute :layout="layout"></scene-attribute>
            </mapgis-ui-tab-pane>
            <mapgis-ui-tab-pane key="2" force-render tab="场景特效">
              <scene-effect :layout="layout"></scene-effect>
            </mapgis-ui-tab-pane>
          </mapgis-ui-tabs>
        </div>
      </slot>
    </mapgis-ui-div>
    <mapgis-ui-button class="openButton" @click="openPanel" type="primary" shape="circle">
      <mapgis-ui-iconfont type="mapgis-setting" />
    </mapgis-ui-button>
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import SceneAttribute from "./components/SceneAttribute";
import SceneEffect from "./components/SceneEffect";

export default {
  name: "mapgis-3d-scene-setting",
  components: {
    SceneAttribute,
    SceneEffect
  },
  mixins: [ServiceLayer],
  props: {
    /*
    * 组件的布局方式，有'horizontal' 'vertical' 'inline'三种选项。
    * */
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    },
    panelStyle: {
      type: Object,
    }
  },
  data() {
    return {
      initial: false,
      modelBloom: false,
      transform: undefined,
      tabBarStyle: {
        margin:'0px'
      },
      show:true,
      hover:false
    };
  },

  mounted() {
    this.initial = true;
    this.$emit("load", this);
  },
  destroyed() {
    this.$_deleteManger("SettingToolManager",function (manager){
      console.log('destroyed');
    });
    this.$emit("unload");
  },
  methods: {

    openPanel(){
      this.show = !this.show;
    },
    closePanel(){
      this.show = false;
    }

  }
};
</script>

<style scoped>

.mapgis-3d-setting-control {
  /*width: 320px;*/
  height: fit-content;
  max-height: 536px;
  overflow: scroll;
  position: absolute;
  top: 30px;
  left: 30px;
  padding: 0 10px;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 0px rgba(3, 25, 57, 0.2);
  border-radius: 4px;
}
.control-header{
  height: 40px;
  border-bottom: 1px solid #F0F0F0;
  line-height: 40px;
}
.title{
  padding-left: 10px;
  font-size: 16px;
  color: #333333;
}
.closeButton2{
  position: absolute;
  top: 12px;
  right: 16px;
  width: 16px;
  height: 16px;
}

.openButton{
  position: absolute;
  top: 30px;
  right: 30px;
}

.closeButton{
  width: 33px;
  height: 33px;
  position: absolute;
  top: 0px;
  right: 0px;
  margin-top: -16.5px;
  margin-right: -16.5px;
}
</style>
