import Mapgis3dMarkerPlotting from "../../cesium/src/components/Layer/Marker/3dMarkerPlotting.vue";

export default {
  title: "三维/图层/标注图层",
  component: Mapgis3dMarkerPlotting,
  argTypes: {
    markers: [
      {
        fid: "1",
        coordinates: [110, 30],
        img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
        properties: {
          name: "测试名称",
          address: "街道1",
          description: "详细描述",
        },
      },
    ],
    selectedMarkers: [],
    highlightStyle: {
      feature: {
        pnt: {
          color: "#ff0000",
          size: 5,
        },
        line: { color: "#ff0000", size: 5 },
        reg: {
          color: "#ff0000",
          size: 5,
        },
      },
    },
    fitBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
    selectionBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <mapgis-web-scene :libPath="libPath" :pluginPath="pluginPath" style="height: 95vh">
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="urlT"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSetID"
          :format="format"
          :tilingScheme="srs"
          :token="token"
      />
      <mapgis-3d-marker-plotting v-bind="$props">
        <mapigs-ui-card slot="popup" slot-scope="{ marker }">
          {{marker.fid}}
        </mapigs-ui-card>
      </mapgis-3d-marker-plotting>
    </mapgis-web-scene>
  `,
  data() {
    return {
      libPath: "http://localhost:8888/static/libs/cdn/cesium/Cesium.js",
      pluginPath:
        "http://localhost:8888/static/libs/cdn/cesium/webclient-cesium-plugin.min.js",
      //天地图地址，请在url地址后面加token
      urlT: "http://t0.tianditu.gov.cn/img_c/wmts",
      //参考系
      tileMatrixSetID: "c",
      srs: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "f5347cab4b28410a6e8ba5143e3d5a35",
      },
    };
  },
});

export const Marker = Template.bind({});
Marker.args = {
  markers: [
    {
      fid: "标绘1",
      coordinates: [110, 30],
      img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
      properties: {
        name: "测试名称",
        address: "街道1",
        description: "详细描述",
      },
      feature: {
        type: "Feature",
        properties: { AREA: 0, PERIMETER: 0, name: "东方市", mapgis_style: 1 },
        geometry: {
          type: "Point",
          coordinates: [110, 30],
        },
      },
    },
    {
      fid: "标绘2",
      coordinates: [114.60937499999999, 32.1011897323209],
      img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
      properties: {
        name: "测试名称",
        address: "街道1",
        description: "详细描述",
      },
      feature: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [98.0859375, 35.60371874069731],
            [108.6328125, 27.21555620902969],
            [114.60937499999999, 32.10118973232094],
            [113.5546875, 38.685509760012],
          ],
        },
      },
    },
    {
      fid: "标绘3",
      coordinates: [91.23046875, 39.90973623453719],
      img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
      properties: {
        name: "测试名称",
        address: "街道1",
        description: "详细描述",
      },
      feature: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [68.73046875, 25.958044673317843],
              [91.23046875, 25.958044673317843],
              [91.23046875, 39.90973623453719],
              [68.73046875, 39.90973623453719],
              [68.73046875, 25.958044673317843],
            ],
          ],
        },
      },
    },
  ],
  selectedMarkers: [],
  highlightStyle: {
    feature: {
      pnt: {
        color: "#ff0000",
        size: 25,
      },
      line: { color: "#ff0000", size: 5 },
      reg: {
        color: "#ff0000",
        size: 5,
      },
    },
  },
  fitBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
  selectionBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
};
