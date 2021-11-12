<template>
  <div>
    <mapgis-ui-div class="mapgis-3d-scene-setting">
      <slot v-if="initial"></slot>
      <slot name="settingTool">
        <div v-show="show" :style="panelStyle" class="setting-control">
<!--          第一种关闭按钮-->
<!--          <div @mouseenter="hover=true" @mouseleave="hover=false">-->
<!--            <img src="./components/关闭.png" class="closeButton" @click="closePanel" v-show="!hover">-->
<!--            <img src="./components/关闭hover.png" class="closeButton" @click="closePanel" v-show="hover">-->
<!--          </div>-->

<!--          第二种关闭按钮-->
          <div class="control-header" >
            <label class="title">设置</label>
            <div @mouseenter="hover=true" @mouseleave="hover=false">
              <img v-show="!hover" class="closeButton2" src="./components/关闭2.png" @click="closePanel">
              <img v-show="hover" class="closeButton2" src="./components/关闭2hover.png" @click="closePanel">
            </div>
          </div>
          <mapgis-ui-tabs
              :animated="false"
              :tabBarStyle="tabBarStyle"
              default-active-key="1"
          >
            <mapgis-ui-tab-pane key="1" tab="基本属性" class="control-content">
              <scene-attribute ref="attr" :layout="layout" @updateSpin="changeSpinning"></scene-attribute>
            </mapgis-ui-tab-pane>
            <mapgis-ui-tab-pane key="2" force-render tab="场景特效" class="control-content">
              <scene-effect ref="effect" :layout="layout" @updateSpin="changeSpinning"></scene-effect>
            </mapgis-ui-tab-pane>
          </mapgis-ui-tabs>
        </div>
      </slot>
    </mapgis-ui-div>
    <mapgis-ui-button class="openButton" shape="circle" type="primary" @click="openPanel">
      <mapgis-ui-iconfont type="mapgis-setting"/>
    </mapgis-ui-button>
    <mapgis-ui-spin :spinning="spinning" size="large" style="top: 50%;left: 50%"/>
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
    /**
    * 组件的布局方式，有'horizontal' 'vertical' 'inline'三种选项。
    */
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    },
    /**
     * 面板样式
     */
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
        margin: '0px',
        textAlign: "center",
        borderBottom: "1px solid #F0F0F0"
      },
      show: true,
      hover: false,
      spinning: false
    };
  },

  mounted() {
    this.initial = true;
    this.$emit("load", this);
  },
  destroyed() {
    this.$_deleteManger("SettingToolManager", function (manager) {
      console.log('destroyed');
    });
    this.$emit("unload");
  },
  methods: {

    openPanel() {
      this.show = !this.show;
    },

    closePanel() {
      this.show = false;
    },

    changeSpinning(e){
      this.spinning = e;
    }

  }
};
</script>

<style scoped>

.setting-control {
  /*width: 320px;*/
  height: fit-content;
  position: absolute;
  top: 30px;
  left: 30px;
  /*padding: 0 10px;*/
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 0px rgba(3, 25, 57, 0.2);
  border-radius: 4px;
}

.control-header {
  height: 40px;
  border-bottom: 1px solid #F0F0F0;
  line-height: 40px;
}

.control-content{
  max-height: 460px;
  overflow: auto;
  padding: 10px;
}

.title {
  padding-left: 20px;
  font-size: 16px;
  color: #333333;
}

.closeButton2 {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 16px;
  height: 16px;
}

.openButton {
  position: absolute;
  top: 30px;
  right: 30px;
}

.closeButton {
  width: 33px;
  height: 33px;
  position: absolute;
  top: 0px;
  right: 0px;
  margin-top: -16.5px;
  margin-right: -16.5px;
}
::v-deep .mapgis-ui-spin-spinning{
  position: absolute;
}
</style>
