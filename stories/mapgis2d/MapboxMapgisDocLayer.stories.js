import Markdown from "../../mapboxgl/docs/api/Layers/igserver/igsDocLayer.md";
import MapgisIgsDocLayer from "../../mapboxgl/src/components/layer/igserver/IgsDocLayer";

export default {
  title: "二维/数据图层/影像/MapGIS/地图服务",
  component: MapgisIgsDocLayer,
  argTypes: {
    layerId: {
      description: "待添加的图层的id，不能与现有的图层冲突",
      type: { name: "String", required: true },
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "必传" },
      },
      control: "text",
    },
    baseUrl: {
      description: "地图请求的基地址路径",
      type: { name: "String", required: false },
      defaultValue: null,
      table: {
        type: {
          summary: "String",
          detail: '格式:"http://{ip}:{port}/igs/rest/mrms/docs"',
        },
        defaultValue: { summary: "null" },
      },
      control: "text",
    },
    layers: {
      description:
        "指定需要被取图的图层序号数组，以“，”分隔。图层序号为图层信息中的LayerIndex字段。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）<br/> " +
        "1. show：仅仅显示指定了图层序号的图层<br/> " +
        "2. hide ：显示除 hide 参数指定图层外所有的图层<br/> " +
        "3. include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层<br/> " +
        "4. exclude: 从默认图层列表里删除这些被指定的图层后，进行显示",
      type: {
        name: "String",
        required: false,
      },
      table: {
        type: {
          summary: "String",
          detail:
            '示例:"show:1,2"\n' +
            "注意:若不传入开头的[show|hide|include|exclude],则默认是显示所有图层 \n" +
            '  eg:"1,2,3"，显示的是所有图层,并非图层1、2、3',
        },
        defaultValue: { summary: "null" },
      },
      control: "text",
    },
    source: {
      description:
        "栅格瓦片源<br/>" +
        "详见[sources-raster使用参考](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-raster)",
      type: { name: "Object | String", required: false },
      table: {
        type: { summary: "Object | String" },
        // defaultValue: { summary: '' },
      },
      control: "object",
    },
    tileSize: {
      description: "输出瓦片大小",
      defaultValue: 512,
      type: { name: "Number", required: false },
      table: {
        type: { summary: "Number" },
        defaultValue: { summary: "512" },
      },
      control: "number",
    },
    filters: {
      description:
        "用户指定的图层过滤条件，它由多个键值对组成，值为过滤条件。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）",
      type: { name: "String", required: false },
      // defaultValue: null,
      table: {
        type: {
          summary: "String",
          detail: '示例:"1:ID>4,3:ID>1"',
        },
        defaultValue: { summary: "null" },
      },
      control: "text",
    },
    igsMapStyle: {
      description:
        "显示参数，指整个地图文档的显示参数。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）",
      type: { name: "Object", required: false },
      defaultValue: null,
      table: {
        type: {
          summary: "Object",
          detail: "示例:{SymbleShow:true,ShowElemRect:true}",
        },
        defaultValue: { summary: "null" },
      },
      control: "object",
    },
    f: {
      description:
        "图片的格式。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）",
      type: { name: "String", required: false },
      defaultValue: "png",
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "png" },
      },
      control: {
        type: "select",
        options: ["jpg", "png", "gif"],
      },
    },
    proj: {
      description:
        "针对整个地图文档进行投影参数设置。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）",
      type: { name: "String", required: false },
      // defaultValue: null,
      table: {
        type: {
          summary: "String",
          detail: '示例:"WGS1984_度"',
        },
        defaultValue: { summary: "null" },
      },
      control: "text",
    },
    guid: {
      description:
        "用户标识地图文档的唯一id。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）",
      type: { name: "String", required: false },
      table: {
        type: { summary: "String" },
        defaultValue: {
          summary: "newGuid()",
          detail: "随机生成一个guid,返回值为一个字符串",
        },
      },
      control: "text",
    },
    cache: {
      description: "是否使用动态裁图功能",
      type: { name: "Boolean", required: false },
      defaultValue: false,
      table: {
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
      control: "boolean",
    },
    isAntialiasing: {
      description: "控制是否高质量显示",
      type: { name: "Boolean", required: false },
      defaultValue: false,
      table: {
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
      control: "boolean",
    },
    update: {
      description: "控制是否更新当前瓦片，仅当 cache 为 true 时有效",
      type: { name: "Boolean", required: false },
      defaultValue: false,
      table: {
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
      control: "boolean",
    },
    mode: {
      description:
        "模式，如果是快显取图（hiRender,fast_display），文档为只读，只有 bbox,w,h 有效。",
      type: { name: "String", required: false },
      // defaultValue: null,
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "null" },
      },
      control: "text",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisIgsDocLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="8" style="height:95vh">
  <mapgis-igs-doc-layer :cache="cache" :layers="layers" :filters="filters" v-bind="$props" />
  <button style="position: absolute;z-index: 1;left:0;top:0;" @click="edit('filters','0:ID>4')">修改filter</button>
  <button style="position: absolute;z-index: 1;left:80px;top:0;" @click="edit('filters','')">置空filter</button>
  <button style="position: absolute;z-index: 1;left:160px;top:0;" @click="edit('layers','show:0,1')">修改layers</button>
  <button style="position: absolute;z-index: 1;left:240px;top:0;" @click="edit('layers','show:0,1,2,3,4,5,6,7')">还原layers</button>
  <button style="position: absolute;z-index: 1;left:330px;top:0;" @click="edit('cache',true)">修改cache</button>
  <button style="position: absolute;z-index: 1;left:420px;top:0;" @click="edit('cache',false)">还原cache</button>
  </mapgis-web-map>`,
  data() {
    return {
      filters: "",
      layers: "show:0",
      cache: false,
    };
  },
  methods: {
    edit(name, value) {
      this[name] = value;
    },
  },
});

export const 地图服务 = Template.bind({});
地图服务.args = {
  layerId: "igs_layer_layerid",
  baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/docs/WorldJWVector`,
  layers: "show:0,1,2,3,4,5,6,7",
  layer: {
    paint: { "raster-opacity": 0.75 },
  },
};

地图服务.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

// const TemplateTile = (args, { argTypes }) => ({
//   props: Object.keys(args),
//   components: { MapgisWebMap, MapgisIgsDocLayer },
//   template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="8" style="height:95vh">
//   <mapgis-igs-doc-layer v-bind="$props" />
//   </mapgis-web-map>`,
//   data() {
//     return {};
//   },
//   methods: {},
// });
//
// export const 动态切片 = TemplateTile.bind({});
// 动态切片.args = {
//   layerId: "igs_layer_layerid",
//   baseUrl:'http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市',
//   layers: 'show:0,1,2,3,4,5,6,7',
//   dynamicTile: true,
// };
