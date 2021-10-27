<template>
  <mapgis-ui-div class="mapgis-3d-setting">
    <slot v-if="initial"></slot>
    <slot name="settingTool">
      <mapgis-ui-tabs
          class="mapgis-3d-setting-control"
          default-active-key="1"
          size="small"
          :animated="false"
      >
        <mapgis-ui-tab-pane key="1" tab="基本属性">
          <scene-attribute :layout="layout"></scene-attribute>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane key="2" force-render tab="场景特效">
          <scene-effect :layout="layout"></scene-effect>
<!--          <mapgis-ui-row>-->
<!--            <mapgis-ui-col :span="5">-->
<!--              <mapgis-ui-checkbox-->
<!--                  :checked="modelBloom"-->
<!--                  @change="modelBloomChange"-->
<!--              >模型泛光-->
<!--              </mapgis-ui-checkbox>-->
<!--            </mapgis-ui-col>-->
<!--          </mapgis-ui-row>-->

        </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
    </slot>
  </mapgis-ui-div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import SceneAttribute from "./components/SceneAttribute";
import SceneEffect from "./components/SceneEffect";

export default {
  name: "mapgis-3d-setting",
  components: {
    SceneAttribute,
    SceneEffect
  },
  mixins: [ServiceLayer],
  props: {
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data() {
    return {
      initial: false,
      modelBloom: false,
      transform: undefined
    };
  },

  mounted() {
    this.initial = true;
    this.$emit("load", this);
  },
  destroyed() {
    this.$emit("unload");
  },
  methods: {
    //模型泛光
    modelBloomChange(e) {
      this.modelBloom = e.target.checked;
      let vm = this;
      if (vm.modelBloom) {
        vm.enableModelBloom();
      } else {
        vm.removeModelBloom();
      }
    },
    enableModelBloom() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let modelBloom = new Cesium.BloomEffect(viewer, [], this.transform); //position传空数组表示对全部模型泛光处理
      modelBloom.add();
      console.log("modelBloom", modelBloom);
      window.CesiumZondy.MeasureToolManager.addSource(
        vueKey,
        vueIndex,
        modelBloom
      );
    },
    removeModelBloom() {
      this.$_deleteManger("MeasureToolManager", function(manager) {
        if (manager.source) {
          manager.source.remove();
        }
      });
    },
    setTransform(transform){
      this.transform = transform;
    },

  }
};
</script>

<style scoped>
.mapgis-3d-setting {
  height: fit-content;
}

.mapgis-3d-setting-control {
  height: fit-content;
  position: absolute;
  left: 10px;
  top: 10px;
  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
}

</style>
