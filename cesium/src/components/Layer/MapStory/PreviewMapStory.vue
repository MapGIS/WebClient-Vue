<template>
  <div>
    <mapgis-ui-story-panel-large
        @closePanel="$_closePanel"
        @flyTo="$_flyTo"
        :showArrow="showArrow"
        :feature="storyFeature"
        :height="panelHeight"
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
import Base64IconsKeyValue from "@mapgis/webclient-vue-ui/src/components/iconfont/Base64IconsKeyValue";
export default {
  name: "mapgis-3d-preview-map-story-layer",
  inject: ["Cesium", "viewer"],
  mixins: [mapStoryService],
  components: {
    "map-collection": mapCollection,
  },
  props: {
    dataSource: {
      type: [Array,String]
    }
  },
  data() {
    return {
      dataSourceCopy: undefined,
      storyFeature: [],
      optArr: [],
      panelHeight: undefined,
      showArrow: true,
      showPanel: true,
      projectMap: undefined
    }
  },
  mounted() {
    this.panelHeight = this.$_getContainerHeight();
    this.$_init();
  },
  methods: {
    $_closePanel() {
      this.showPanel = false;
    },
    $_init() {
      let vm = this;
      if(typeof this.dataSource === "string"){
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
                      image: img
                    }
                  });
                }
              }
            }
          }
        }, function (error) {
          console.error(error);
        });
      }else if(this.dataSource instanceof Array){

      }
    }
  }
}
</script>

<style scoped>

</style>