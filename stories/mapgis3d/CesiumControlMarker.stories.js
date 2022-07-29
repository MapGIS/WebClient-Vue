import Mapgis3dMarker from "../../cesium/src/components/UI/Marker/Marker.vue";
import Markdown from "../../cesium/docs/api/ui/marker.md";

export default {
  title: "三维/场景子组件/Marker",
  component: Mapgis3dMarker,
  argTypes: {
    longitude: 110,
    latitude: 30,
    height: 0,
    iconUrl:""
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="urlT"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSetID"
          :format="format"
          :tilingScheme="srs"
          :token="token"
      />
      <template>
        <mapgis-3d-marker
        :longitude="longitude"
        :latitude="latitude"
        :height="height"
        :text="text"
        :iconUrl="iconUrl"
        :enableCircle="true"
        @mouseEnter="mouseEnter"
        @mouseLeave="mouseLeave"
        ></mapgis-3d-marker>
      </template>
      <template>
        <mapgis-3d-marker
          :key="'primitive'"
          :enableCluster="true"
          :geojson="'http://${window.webclient.ip}:${window.webclient.port}/geojson/cityResource/education.json'"
          :height="0"
          :iconUrl="'http://${window.webclient.ip}:${window.webclient.port}/img/poi-route.png'"
          :iconWidth="32"
          :iconHeight="32"
        ></mapgis-3d-marker>
      </template>
      <template>
        <mapgis-3d-marker
          :key="'hospital'"
          :usePrimitive="true"
          :circleColor="circleColors"
          :geojson="'http://${window.webclient.ip}:${window.webclient.port}/geojson/cityResource/hospitalization.json'"
          :height="0"
          :iconUrl="'http://${window.webclient.ip}:${window.webclient.port}/img/poi-zhuan.png'"
          :iconWidth="32"
          :iconHeight="32"
          @click="click"
        ></mapgis-3d-marker>
      </template>
    </mapgis-web-scene>
  `,
  data(){
    return {
      urlT: "http://t0.tianditu.gov.cn/img_c/wmts",
      //参考系
      tileMatrixSetID: "c",
      srs: "EPSG:4326",
      layer:"img",
      format: "tiles",
      token:{
        key: "tk",
        value: "f5347cab4b28410a6e8ba5143e3d5a35"
      },
      circleColors: '#ff0000'
    }
  },
  methods: {
    mouseEnter(icon){
      console.log("mouseEnter",icon);
    },
    mouseLeave(icon){
      console.log("mouseLeave",icon);
    },
    click(icon){
      console.log("click",icon);
    }
  }
});

export const Marker = Template.bind({});
Marker.args = {
  longitude: 114.4018,
  latitude: 30.4673,
  longitude2: 115,
  latitude2: 31,
  height: 0,
  iconUrl: "http://develop.smaryun.com/static/data/picture/icon.png",
  text: "这是entity测试",
};
Marker.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
