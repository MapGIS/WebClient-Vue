import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisOgcWmsLayer from "../../cesium/src/components/Layer/OGC/OGCWMSLayer.vue";

export default {
  title: "三维/图层/OGC/WMS",
  component: MapgisOgcWmsLayer,
  argTypes: {
    baseUrl: {
      description: '服务基地址',
      type: { name: 'String', required: true },
      table: {
        type: { summary: 'String' }
      },
      control: 'text'
    },
    layers: {
      description: '图层名称或id',
      type: { name: 'String', required: true },
      table: {
        type: { summary: 'String' }
      },
      control: 'text'
    },
    layerStyle: {
      description: '控制地图的显隐、透明度以及顺序',
      type: { name: 'Object', required: false },
      table: {
        type: { summary: 'Object' }
      },
      control: 'Object'
    },
    // baseUrl:"http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer",
    // layers: "北京市,绿地_1,绿地_2,绿地_3,绿地_4,水域_3,水域_2,水域_1,大学,学校,动物园,高尔夫,观光胜地,果园,住宅用地,医院,商业用地,建筑物,铁路_1,铁路_2,铁路_3,主干道,主干道,高速公路_1,高速公路_1_9-10,三级道路_链接,三级道路,二级道路_链接,二级道路,一级道路_链接,一级道路,主干道_链接,主干道,主干道,高速公路_链接,高速公路_2,高速公路_2,三级道路_链接,三级道路,二级道路_链接,二级道路,一级道路_链接,一级道路,地铁,主干道_链接,主干道,主干道,高速公路_链接,高速公路_2,高速公路_2,地铁站POI,山顶,果园poi,汽车站点POI,大学poi,学校poi,中小学POI,幼儿园POI,医院POI,口腔医院POI,派出所POI,检察院POI,银行POI,邮局POI,体育馆POI,纪念碑POI,博物馆POI,名胜古迹点,动物园poi,观光胜地poi,主题公园POI,宾馆POI,百货店POI,便利店POI,书店POI,快餐POI,咖啡馆POI,电影院POI,高尔夫poi,村庄点,市镇点,区县点,首都点",
    // layerStyle: {
    //   visible: true,
    //   opacity: 1,
    //   zIndex: 10
    // },
    vueIndex: 1,
    options: {}
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisOgcWmsLayer },
  template: `<mapgis-web-globe style="height:95vh">
    <mapgis-3d-ogc-wms-layer v-bind="$props"/>
  </mapgis-web-globe>`,
  methods:{
  }
});

export const OGCWMS = Template.bind({});
OGCWMS.args = {
  baseUrl:`http://${window.webclient.ip}:${window.webclient.port}/igs/rest/ogc/doc/北京市/WMSServer`,
  // layers: "北京市,绿地_1,绿地_2,绿地_3,绿地_4,水域_3,水域_2,水域_1,大学,学校,动物园,高尔夫,观光胜地,果园,住宅用地,医院,商业用地,建筑物,铁路_1,铁路_2,铁路_3,主干道,主干道,高速公路_1,高速公路_1_9-10,三级道路_链接,三级道路,二级道路_链接,二级道路,一级道路_链接,一级道路,主干道_链接,主干道,主干道,高速公路_链接,高速公路_2,高速公路_2,三级道路_链接,三级道路,二级道路_链接,二级道路,一级道路_链接,一级道路,地铁,主干道_链接,主干道,主干道,高速公路_链接,高速公路_2,高速公路_2,地铁站POI,山顶,果园poi,汽车站点POI,大学poi,学校poi,中小学POI,幼儿园POI,医院POI,口腔医院POI,派出所POI,检察院POI,银行POI,邮局POI,体育馆POI,纪念碑POI,博物馆POI,名胜古迹点,动物园poi,观光胜地poi,主题公园POI,宾馆POI,百货店POI,便利店POI,书店POI,快餐POI,咖啡馆POI,电影院POI,高尔夫poi,村庄点,市镇点,区县点,首都点",
  layers: "t0,t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20,t21,t22,t23,t24,t25,t26,t27,t28,t29,t30,t31,t32,t33,t34,t35,t36,t37,t38,t39,t40,t41,t42,t43,t44,t45,t46,t47,t48,t49,t50,t51,t52,t53,t54,t55,t56,t57,t58,t59,t60,t61,t62,t63,t64,t65,t66,t67,t68,t69,t70,t71,t72,t73,t74,t75,t76,t77,t78,t79,t80,t81,t82",
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 10
  },
  vueIndex: 1,
  options: {}
};
