import Markdown from "../../cesium/docs/api/ui/rotate.md";

export default {
    title: "三维/场景子组件/绕点旋转",
    argTypes: {
    }
}

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    template: `
      <mapgis-web-scene
        style="height:100vh">
    <mapgis-3d-ogc-wmts-layer
        :baseUrl="url"
        :wmtsLayer="layer"
        :tileMatrixSet="tileMatrixSet"
        :format="format"
        :tilingScheme="tilingScheme"
        :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-ogc-wmts-layer
        :baseUrl="url1"
        :wmtsLayer="layer1"
        :tileMatrixSet="tileMatrixSet1"
        :format="format"
        :tilingScheme="tilingScheme"
        :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-rotate></mapgis-3d-rotate>
    </mapgis-ui-card>
    <mapgis-3d-statebar></mapgis-3d-statebar>
    </mapgis-web-scene>`
});

export const rotate = Template.bind({});
rotate.args = {
    url: "http://t7.tianditu.gov.cn/img_c/wmts",
    tileMatrixSet: "c",
    tilingScheme: "EPSG:4326",
    layer: "img",
    format: "tiles",
    token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752",
    },
    url1: "http://t7.tianditu.gov.cn/cva_c/wmts",
    tileMatrixSet1: "c",
    tilingScheme1: "EPSG:4326",
    layer1:"cva",
    baseUrl:"http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/docs/北京市",
    boundaryStyle:{
        color: "#1E90FF",
        opacity: 0.5,
        outlineColor:"rgba(0,191,255,0.5)"
    },
};

rotate.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};