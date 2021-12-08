import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";

export default {
    title: "三维/图层/ArcGISServer/地图图层"
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebGlobe},
    template: `
      <mapgis-web-scene :style="{height: '95vh'}">
      <mapgis-3d-arcgis-map-layer v-bind="$props"/>
      </mapgis-web-scene>`,
});

export const exportMap = Template.bind({});
exportMap.args = {
    baseUrl: "http://219.142.81.85/arcgis/rest/services/20wanZL/MapServer",
    layers: "show:0,2,4,7,9,10,11,12",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
    options: {
        tileWidth: 256,
        tileHeight: 256,
    },
    srs: "EPSG:4326"
};
