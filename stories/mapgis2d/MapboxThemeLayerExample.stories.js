import wuhan from "../assets/geojson/wuhan"
export default {
  title: "二维/图层/专题图/专题图示例",
  argTypes: {
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :mapStyle="mapStyle" :zoom="8" style="height:96vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
  data(){
    return {
      mapStyle: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "背景",
            type: "background",
            paint: {
              "background-color": "rgba(0, 0, 0, 1)"
            }
          }
        ],
        glyphs: "http://localhost:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
        // glyphs: "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
      },
    }
  }
});

export const 武汉2020年GDP = Template.bind({});
武汉2020年GDP.args = {
  dataSource: wuhan,
  type: "range",
  field: "gdp",
  enableLegend: true,
  legendOption: {
    title: "2020武汉行政区GDP(亿元)",
    fields: ["极低","低","中等","高","极高"],
  },
  themeOptions: {
    layerStyle: {
      color: "#caf0f8,#90e0ef,#00b4d8,#0077b6,#03045e"
    },
    textStyle: {
      enableTurf: true,
      fontColor: "#FFFFFF",
      fontSize: 24,
      field: "gdp",
      fontFamily: "宋体",
      fieldAfter: "(亿元)",
      fieldBefore: "{name}\n",
      haloColor: "#eccb39",
      haloWidth: 1,
    }
  }
}
