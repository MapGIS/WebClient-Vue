import Mapgis3dLink from "../../cesium/src/components/UI/Controls/Link/Link.vue";
import "../style/link.css";

export default {
  title: "三维/交互/多屏联动",
  component: Mapgis3dLink,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dLink },
  data() {
    return {
      link: false,
      url1:
        "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      url2: "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      url3:
        "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
      url4:
        "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
    };
  },
  methods: {
    changeMode() {
      this.link = !this.link;
    },
  },
  template: `<div class="mapgis-link-test">
    <div class="item top-left">
        <mapgis-web-scene>
            <mapgis-3d-raster-layer :url="url1"> </mapgis-3d-raster-layer>
            <mapgis-3d-link :enable="link"></mapgis-3d-link>
        </mapgis-web-scene>
    </div>
    <div class="item top-right">
        <mapgis-web-scene>
            <mapgis-3d-raster-layer :url="url2"> </mapgis-3d-raster-layer>
        </mapgis-web-scene>
    </div>
    <div class="item bottom-left">
        <mapgis-web-scene>
            <mapgis-3d-raster-layer :url="url3"> </mapgis-3d-raster-layer>
        </mapgis-web-scene>
    </div>
    <div class="item bottom-right">
        <mapgis-web-scene>
            <mapgis-3d-raster-layer :url="url4"> </mapgis-3d-raster-layer>
        </mapgis-web-scene>
    </div>
    <div :class="{'control': true, active: link}" v-on:click="changeMode"></div>
  </div>`,
});

export const 多屏联动 = Template.bind({});
多屏联动.args = {};
