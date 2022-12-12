import MapgisOgcWmtsLayer from "../../cesium/src/components/Layer/OGC/OGCWMTSLayer.vue";

export default {
  title: "三维/数据图层/影像/MapGIS",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    options: {
      description: '当出现瓦片错级的情况(如使用新版本发布老版本的平台裁剪出来的瓦片）时，需要手动传入options中的tileMatrixLabels参数，其值为xml文件中TileMatrix字段下的ows:Identifier字段值组成的数组',
      table: {
        type: {
          detail: '示例:通过`http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/ogc/{serverName}/WMTSServer`可以获取xml文件信息，以下为xml信息片段。\n' +
            "当出现igserver与平台版本不一致导致的瓦片错级时，以以下xml信息为例需要传入`options: {tileMatrixLabels:['EPSG:4326_北京市1_028mm_GB:1','EPSG:4326_北京市1_028mm_GB:2']}`\n" +
            '<TileMatrix>\n' +
            '<ows:Identifier>EPSG:4326_北京市1_028mm_GB:0</ows:Identifier>\n' +
            '<ScaleDenominator>2.798544199868153E8</ScaleDenominator>\n' +
            '<TopLeftCorner>90.0 -180.0</TopLeftCorner>\n' +
            '<TileWidth>512</TileWidth>\n' +
            '<TileHeight>512</TileHeight>\n' +
            '<MatrixWidth>1</MatrixWidth>\n' +
            '<MatrixHeight>1</MatrixHeight>\n' +
            '</TileMatrix>\n' +
            '<TileMatrix>\n' +
            '<ows:Identifier>EPSG:4326_北京市1_028mm_GB:1</ows:Identifier>\n' +
            '<ScaleDenominator>1.3992720999340764E8</ScaleDenominator>\n' +
            '<TopLeftCorner>90.0 -180.0</TopLeftCorner>\n' +
            '<TileWidth>512</TileWidth>\n' +
            '<TileHeight>512</TileHeight>\n' +
            '<MatrixWidth>1</MatrixWidth>\n' +
            '<MatrixHeight>1</MatrixHeight>\n' +
            '</TileMatrix>\n' +
            '<TileMatrix>\n' +
            '<ows:Identifier>EPSG:4326_北京市1_028mm_GB:2</ows:Identifier>\n' +
            '<ScaleDenominator>6.996360499670382E7</ScaleDenominator>\n' +
            '<TopLeftCorner>90.0 -180.0</TopLeftCorner>\n' +
            '<TileWidth>512</TileWidth>\n' +
            '<TileHeight>512</TileHeight>\n' +
            '<MatrixWidth>1</MatrixWidth>\n' +
            '<MatrixHeight>1</MatrixHeight>\n' +
            '</TileMatrix>',
        }
      },
    }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisOgcWmtsLayer },
  template: `<mapgis-web-scene style="height: 95vh">
    <mapgis-3d-ogc-wmts-layer v-bind="$props"/>
  </mapgis-web-scene>`,
  data() {
    return {
    }
  },
  methods: {
  }
});

export const WMTS = Template.bind({});
WMTS.args = {
  baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/OGC_4326_CHINA/WMTSServer`,
  wmtsLayer: "beijing",
  tileMatrixSet: "EPSG:4326_北京市_028mm_GB",
  tilingScheme: "EPSG:4326",
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 10
  },
  vueIndex: 1,
  options: {}
};

