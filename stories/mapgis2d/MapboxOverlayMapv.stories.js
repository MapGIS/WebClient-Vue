import MapgisMapvLayer from "../../mapboxgl/src/components/overlay/MapvLayer.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisNavigationControl from "../../mapboxgl/src/components/UI/controls/NavigationControl";
import { BaseServer } from "@mapgis/webclient-es6-service";

export default {
  title: "二维/可视化/MapV",
  component: MapgisMapvLayer,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisMapvLayer, BaseServer, MapgisNavigationControl },
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/dark-v9",
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA",
      center: [114.321317, 30.398428],
      zoom: 3,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.geojson = {};
      let randomCount = 500;
      let data = [];
      while (randomCount--) {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [75 + Math.random() * 50, 20.3 + Math.random() * 20],
          },
          properties: {
            count: 30 * Math.random(),
          },
        });
      }
      this.geojson = {
        features: data,
      };
    },
  },
  template: `
      <mapgis-web-map :center="center" :accessToken="accessToken" :zoom="zoom" :map-style="mapStyle" style="height:95vh">
      <mapgis-navigation-control position="top-right"/>
      <mapgis-mapv-layer v-bind="$props"></mapgis-mapv-layer>
      </mapgis-web-map>
    `,
});

export const mapv = Template.bind({});
mapv.args = {
  options: {
    postRender:true,
    context: "2d",
    fillStyle: "rgba(55, 50, 250, 0.8)",
    size: 40,
    globalAlpha: 0.5,
    label: {
      show: true,
      fillStyle: "white",
      shadowColor: "yellow",
      font: "15px Arial",
      shadowBlur: 10,
    },
    gradient: {
      0: "rgba(49, 54, 149, 0)",
      0.2: "rgba(69,117,180, 0.7)",
      0.3: "rgba(116,173,209, 0.7)",
      0.4: "rgba(171,217,233, 0.7)",
      0.5: "rgba(224,243,248, 0.7)",
      0.6: "rgba(254,224,144,0.7)",
      0.7: "rgba(253,174,97,0.7)",
      0.8: "rgba(244,109,67,0.8)",
      0.9: "rgba(215,48,39,0.8)",
      0.95: "rgba(165, 0, 38,0.8)",
    },
    shadowColor: "rgba(255, 255, 50, 1)",
    shadowBlur: 10,
    max: 100,
    draw: "grid",
  },
  geojson: {},
};

export const 聚类 = Template.bind({});
聚类.args = {
  options: {
    // shadowColor: 'rgba(255, 250, 50, 1)',
    // shadowBlur: 10,
    // 非聚合点的颜色和大小，未设置icon或icon获取失败时使用
    fillStyle: "rgba(255, 50, 0, 1.0)",
    size: 50 / 3 / 2, // 非聚合点的半径
    // 非聚合时点的icon设置，会被具体点的设置覆盖，可设置为空
    // iconOptions: {
    //     url: 'images/marker.png',
    //     width: 50 / 3,
    //     height: 77 / 3,
    //     offset: {
    //         x: 0,
    //         y: 0
    //     }
    // },
    minSize: 8, // 聚合点最小半径
    maxSize: 31, // 聚合点最大半径
    globalAlpha: 0.8, // 透明度
    clusterRadius: 50, // 聚合像素半径
    maxClusterZoom: 18, // 最大聚合的级别
    maxZoom: 19, // 最大显示级别
    minPoints: 5, // 最少聚合点数，点数多于此值才会被聚合
    extent: 400, // 聚合的细腻程度，越高聚合后点越密集
    label: {
      // 聚合文本样式
      show: true, // 是否显示
      fillStyle: "white",
      // shadowColor: 'yellow',
      // font: '20px Arial',
      // shadowBlur: 10,
    },
    gradient: { 0: "blue", 0.5: "yellow", 1.0: "rgb(255,0,0)" }, // 聚合图标渐变色
    draw: "cluster",
  },
  geojson: {},
};
