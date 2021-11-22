import MapgisMapvLayer from "../../mapboxgl/src/components/overlay/MapvLayer.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisNavigationControl from "../../mapboxgl/src/components/UI/controls/NavigationControl";
import axios from "axios";

export default {
  title: "二维/可视化/MapV-聚类",
  component: MapgisMapvLayer,
  argTypes: {
    options: {},
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisMapvLayer, MapgisNavigationControl },
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/dark-v9",
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA",
      center: [114.321317, 30.398428],
      zoom: 3,
      geojson: {},
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const vm = this;
      this.geojson = {};
      let result = await axios.get("./geojson/china-city.geojson");
      const { data } = result;
      let fs = data.features.map((f) => {
        f.properties.count = Math.random() * 30;
        return f;
      });
      vm.geojson = {
        features: fs,
      };
    },
  },
  template: `
      <mapgis-web-map :center="center" :accessToken="accessToken" :zoom="zoom" :map-style="mapStyle" style="height:95vh">
        <mapgis-navigation-control position="top-right"/>
        <mapgis-mapv-layer :options="options" :geojson="geojson"></mapgis-mapv-layer>
      </mapgis-web-map>
    `,
});

export const 聚类 = Template.bind({});
聚类.args = {
  options: {
    postRender: true,
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
};
