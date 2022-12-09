import Mapgis3dLink from "../../cesium/src/components/UI/Controls/Link/Link.vue";
import "../style/link.css";

export default {
  title: "三维/场景控制/联动/二三维联动",
  component: Mapgis3dLink,
  argTypes: {
    timestamp: 100,
  },
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
      rect: {},
    };
  },
  watch: {
    rect: function (next) {
      const { east, north, south, west } = next["2d"];
      console.log(east, north, south, west);
      let map = this.map || window.map;
      let bbox = [
        [west, south],
        [east, north],
      ];
      map.fitBounds(bbox, {
        duration: 0,
      });
    },
  },
  methods: {
    changeMode() {
      this.link = !this.link;
    },
    handle2dLoad(e) {
      window.map = this.map = e.map;
    },
  },
  template: `<div class="mapgis-link-test">
    <div class="mapbox-item top-left">
      <mapgis-web-map crs="EPSG:3857"  @load="handle2dLoad">
        <mapgis-rastertile-layer :url="url2" layerId="raster_tdt" />
      </mapgis-web-map>
    </div>
    <div class="cesium-item top-right">
      <mapgis-web-scene>
        <mapgis-3d-raster-layer :url="url1"> </mapgis-3d-raster-layer>
        <mapgis-3d-link :enable="link" v-model="rect" ></mapgis-3d-link>
      </mapgis-web-scene>
    </div>
    <div :class="{'control-2d-3d': true, 'link-active': link}" v-on:click="changeMode"></div>
  </div>`,
});

export const 二三维联动 = Template.bind({});
二三维联动.args = {
  timestamp: 1,
};
