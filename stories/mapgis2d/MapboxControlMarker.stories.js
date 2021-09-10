import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../../mapboxgl/src/components/layer/RasterLayer.js";
import MapgisMarker from "../../mapboxgl/src/components/UI/Marker.vue";

export default {
  title: "二维/地图子组件/标注",
  component: MapgisMarker,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /.*Data$/,
  argTypes: {
    offset:{
      description:'相对于标注位置的偏移量，单位为像素，向左和向上为负',
      type: {name: 'Array<number>', required: false},
      defaultValue: () => [0, 0],
      table:{
        type:{summary:'Array<number>',detail:'格式:[X方向偏移量,Y方向偏移量]'},
        defaultValue:{summary:"[0, 0]"}
      },
      control: 'object'
    },
    coordinates:{
      description:'标注的经纬度',
      type: {name: 'Array<number>', required: false},
      // defaultValue: () => [0, 0],
      table:{
        type:{summary:'Array<number>',detail:'格式:[经度,纬度]'},
        defaultValue:{summary:"必传"}
      },
      control: 'object'
    },
    anchor: {
      description:'设置coordinates定位的标注的部位，默认是标注的中心部位',
      type:{ name: 'String', required: false },
      defaultValue:'center',
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: 'center' },
      },
      control:{
        type:'select',
        options:['center','top','bottom','left','right','top-left','top-right','bottom-left','bottom-right']
      }
    },
    color:{
      description:'当没有自定义标注时应用于标注的颜色，默认为浅蓝色',
      type:{ name: 'String', required: false },
      defaultValue:'#3FB1CE',
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: '#3FB1CE' },
      },
      control:'color'
    },
    draggable:{
      description:'控制标注在地图上能否被拖动',
      type: { name: 'Boolean', required: false },
      defaultValue: false,
      table:{
        type: { summary: 'Boolean' },
        defaultValue: { summary: 'false' },
      },
      control:'boolean'
    } ,
    more:{
      name:'更多参数',
      description:'[marker参数介绍](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker)'
    }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisRasterLayer, MapgisMarker },
  methods: actionsData,
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3" style="height:60vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-marker v-bind="$props">
<!--      <div slot="marker" style="background: #ffffff;padding: 6px;border: 3px solid #ccc;border-radius: 3px;">内部自定义槽</div>-->
    </mapgis-marker>
  </mapgis-web-map>`,
});

export const Marker = Template.bind({});
Marker.args = {
  color: "#37495E",
  offset: [20, 20],
  coordinates: [110, 30],
};

export const actionsData = {
  onEventName: (e) => {},
};
