import wuhan from "../assets/geojson/wuhan"
export default {
  title: "二维/图层/专题图/开启Tips和Popup/多边形数据",
  argTypes: {
    dataSource: {
      description: "geojson格式的数据源或者geojson数据源的URl，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    type: {
      description: "<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    field: {
      description: "<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    enableTips: {
      description: "是否开启Tips，默认不开启，Tips是指当鼠标移动到某一个要素内时，会弹出一个窗口，显示要素信息",
      table: {
        defaultValue: {summary: 'false'},
      },
    },
    enablePopup: {
      description: "是否开启Popup，默认不开启，Popup是指当鼠标点击在图层上时，会弹出一个窗口，显示要素信息，但不会随着鼠标移动而移动",
      table: {
        defaultValue: {summary: 'false'},
      },
    },
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:96vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
});

export const  开启Tips和Popup = Template.bind({});
开启Tips和Popup.args = {
  dataSource: wuhan,
  type: "range",
  field: "adcode",
  enableTips: true,
  enablePopup: true,
}
