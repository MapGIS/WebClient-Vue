<template>
  <div :style="{height: panelHeight + 'px'}">
    <mapgis-ui-story-panel-large
      @closePanel="$_closePanel"
      @flyTo="$_flyTo"
      @play="$_preview"
      :showArrow="enableArrow"
      :showPlay="enablePlay"
      :dataSource="storyFeature"
      :height="panelHeight"
      :width="width"
      :enableFullScreen="enableFullScreen"
      :enableClose="enableClose"
      ref="storyPanel"
      v-show="showPanel"
    />
    <map-collection :key="index" v-for="(opt,index) in optArr" :options="opt"/>
    <map-collection v-if="projectMap" :options="projectMap"/>
  </div>
</template>

<script>
import {MRFS} from "@mapgis/webclient-es6-service"
import mapCollection from "./mapCollection";
import mapStoryService from "./mapStoryService";
import Base64IconsKeyValue from "./Base64IconsKeyValue";
import GraphicLayerService from "../Graphic/GraphicLayerService";

export default {
  name: "mapgis-3d-preview-map-story",
  inject: ["Cesium", "viewer"],
  mixins: [mapStoryService, GraphicLayerService],
  components: {
    "map-collection": mapCollection,
  },
  props: {
    dataSource: {
      type: [Object, String]
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    enableFullScreen: {
      type: Boolean,
      default: true
    },
    enableArrow: {
      type: Boolean,
      default: true
    },
    enablePlay: {
      type: Boolean,
      default: true
    },
    enableClose: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
      },
      deep: true
    }
  },
  data() {
    return {
      dataSourceCopy: undefined,
      storyFeature: [],
      optArr: [],
      panelHeight: undefined,
      showPanel: true,
      projectMap: undefined
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    $_preview() {
      let vm = this;
      this.$refs.storyPanel.$_resetFeature();
      this.$_addGraphicByStory(this.dataSource, function () {
        vm.$_play(vm.dataSource.chapters, [vm.dataSource], function (index) {
          if (vm.$refs.storyPanel) {
            if (index > 0) {
              vm.$refs.storyPanel.$_nextFeature();
            }
          }
        });
      });
    },
    $_closePanel() {
      this.showPanel = false;
    },
    projectPreview() {
      this.$nextTick(function () {
        this.$_preview();
      });
    },
    chapterPreview(chapters) {
      this.storyFeature = dataSource.chapters;
    },
    $_init() {
      let vm = this;
      if (this.height) {
        this.panelHeight = this.height;
      }
      if (typeof this.dataSource === "string") {
        MRFS.FeatureService.get(this.dataSource, function (result) {
          if (typeof result === "string") {
            result = JSON.parse(result);
          }
          const {features, map} = result;
          vm.projectMap = map;
          if (features && features instanceof Array) {
            vm.storyFeature = features;
            for (let i = 0; i < features.length; i++) {
              const {map} = features[i];
              const {geometry} = features[i].baseUrl;
              const {x, y, z} = geometry;
              if (map) {
                map.id = features[i].id;
                vm.optArr.push(map);
              }
              if (x && y && z) {
                let img = document.createElement("img");
                let imgUrl = features[i].layerStyle.billboard.image;
                if (typeof imgUrl === 'number') {
                  imgUrl = Base64IconsKeyValue[imgUrl].value;
                }
                img.src = imgUrl;
                img.onload = function () {
                  vm.viewer.entities.add({
                    id: features[i].id,
                    position: new Cesium.Cartesian3(x, y, z),
                    billboard: {
                      image: img,
                      disableDepthTestDistance: Number.POSITIVE_INFINITY
                    }
                  });
                }
              }
            }
          }
        }, function (error) {
          console.error(error);
        });
      } else if (this.dataSource instanceof Object) {
        this.storyFeature = this.dataSource.chapters;
      }
    }
  }
}
</script>

<style scoped>

</style>