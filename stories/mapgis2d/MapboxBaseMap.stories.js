import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisWebMapMd from "../../mapboxgl/docs/guide/basemap.md";

export default {
    title: "二维/地图/地图对象",
    component: MapgisWebMap,
    argTypes: {
        mapStyle: {
            description: '地图样式<br/>' +
                '[style参考](https://docs.mapbox.com/api/maps/styles/#mapbox-styles)',
            type: {name: 'Object | String', required: false},
            defaultValue: () => {
                return {
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
                    ]
                };
            },
            table: {
                type: {summary: 'Object | String'},
                defaultValue: {
                    summary: '{version: 8,\n' +
                        'sources: {},\n' +
                        'layers:[{\n' +
                        '\tid:"背景",\n' +
                        '\ttype: "background",\n' +
                        '\tpaint: {\n' +
                        '\t\t"background-color": "rgba(0, 0, 0, 1)"\n' +
                        '\t}\n' +
                        '}]}'
                },
            },
            control: 'object'
        },
        zoom: {
            description:'地图初始缩放级别',
            defaultValue:0 ,
            type: { name: 'Number', required: false },
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '0' },
            },
            control:'number'
        },
        center: {
            description:'地图显示中心坐标，以经纬度为单位',
            type: {name: 'Object | Array', required: false},
            defaultValue: undefined,
            table:{
                type:{summary:'Object | Array'},
                defaultValue:{summary:"undefined"}
            },
            control: 'object'
        },
        crs: {
            description:'地图坐标系',
            type:{ name: 'String', required: false },
            defaultValue:'EPSG:3857',
            table:{
                type:{
                    summary: 'String',
                },
                defaultValue: { summary: 'EPSG:3857' },
            },
            control:'text'
        },
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebMap},
    parameters: {
        docs: {
            page: null,
        },
    },
    template: `
      <mapgis-web-map v-bind="$props" style="height:95vh">
      <mapgis-rastertile-layer layerId="tdt"
                               url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"/>
      </mapgis-web-map>
    `,
});


export const 地图 = Template.bind({});
地图.args = {
  mapStyle: {
    version: 8,
    sources: {},
    layers: [
      {
        id: "背景",
        type: "background",
        paint: {
          "background-color": "rgba(0, 0, 0, 0.5)",
        },
      },
    ],
  },
  zoom: 3,
  center: [114.3, 30.5],
  crs: "EPSG:4326",
};

地图.parameters = {
    docs: {
        description: {
            component: MapgisWebMapMd,
        },
    },
};
