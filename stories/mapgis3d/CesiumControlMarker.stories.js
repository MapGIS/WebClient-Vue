export default {
  title: "三维/场景子组件/Marker",
  argTypes: {
    position: {
      longitude: 110,
      latitude: 30,
      height: 0,
    },
    showed: true,
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
    <mapgis-3d-marker
        :longitude="longitude"
        :latitude="latitude"
        :height="height"
        :text="text"
        :iconUrl="iconUrl"
        :heightReference="heightReference"
        @mouseEnter="mouseEnter"
        @mouseLeave="mouseLeave"
    ></mapgis-3d-marker>
    <mapgis-3d-marker
        :longitude="longitude2"
        :latitude="latitude2"
        :height="height"
        :text="text"
        :iconUrl="iconUrl"
        :heightReference="heightReference"
        @mouseEnter="mouseEnter"
        @mouseLeave="mouseLeave"
    ></mapgis-3d-marker>
    </mapgis-web-scene>
  `,
  data(){
    return {
      url: 'http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels',
      //天地图地址，请在url地址后面加token
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
      longitude: 114.4018,
      latitude: 30.4673,
      longitude2: 115,
      latitude2: 31,
      height: 0,
      iconUrl: "http://develop.smaryun.com/static/data/picture/icon.png",
      text: "这是测试",
      heightReference: "clamped",
    }
  },
  methods: {
    mouseEnter(options, longitude, latitude, height){
      console.log("mouseEnter",options, longitude, latitude, height);
    },
    mouseLeave(options, longitude, latitude, height){
      console.log("mouseLeave",options, longitude, latitude, height);
    }
  }
});

export const Marker = Template.bind({});
Marker.args = {
  position: {
    longitude: 110,
    latitude: 30,
    height: 0,
  },
  showed: true,
};
