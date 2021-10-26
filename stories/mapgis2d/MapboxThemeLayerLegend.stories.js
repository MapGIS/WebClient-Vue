import wuhan from "../assets/geojson/wuhan"
import {formatObjectToHtml} from "../assets/util/util"
export default {
  title: "二维/图层/专题图/开启图例",
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
    themeOptions: {
      description:  "专题图样式，包含专题图图层样式、分段样式以及标签样式，样式如下：<br>" +
          "1、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式(略)<br>" +
          "2、<span class='storybook-span'>styleGroups</span>(选填)：分段样式(略)<br>" +
          "3、<span class='storybook-span'>textStyle</span>(选填)：标签样式(略)",
      table:{
        type:{ summary: '专题图样式',detail: formatObjectToHtml({
            layerStyle: {
              color: "D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
              opacity: 1,
              outlineWidth: 1,
              outlineColor: "#000000",
              outlineOpacity: 1
            },
            styleGroups: [
              {
                start: "起始值",
                edn: "结束值",
                style: {
                  color: "#FFFFFF",
                  opacity: 1
                }
              }
            ],
            textStyle: {
              field: "字段名",
              fontColor: "#000000",
              fontFamily: "微软雅黑",
              fontSize: 12,
              spacing: 0.05,
              rotate: 0,
              haloColor: "#FFFFFF",
              haloWidth: 1,
              haloBlur: 1,
              lineHeight: 1.2,
              maxWidth: 10,
              xOffset: 0,
              yOffset: 0,
              align: "center"
            }
          }) },
        defaultValue: { summary: 'null' },
      }
    },
    legendOptions: {
      description: "图例参数，设置如下",
      table:{
        type:{ summary: '图例参数样式',detail: formatObjectToHtml({
            title: "图例标题,String对象",
            fields: "图例里面要显示的字段，Array对象，请与专题图的渐变颜色数量保持一致",
            style: {
              containerStyle: "图例容器样式"
            },
          }) },
        defaultValue: { summary: 'null' },
      }
    }
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:4326" :mapStyle="mapStyle" :center="[114.299039,30.594797]" :zoom="8" style="height:96vh">
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
              "background-color": "rgba(255, 255, 255, 1)"
            }
          }
        ],
        // glyphs: "http://localhost:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
        glyphs: "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
      },
    }
  }
});

export const  开启图例 = Template.bind({});
开启图例.args = {
  dataSource: wuhan,
  type: "range",
  field: "adcode",
  themeOptions: {
    layerStyle: {
      color: "#3D5941,#B5B991,#F6EDBD,#DE8A5A,#CA562C",
      opacity: 1,
      outlineWidth: 5,
      outlineColor: "#FFFF00",
      outlineOpacity: 1
    }
  },
  enableLegend: true,
  legendOptions: {
    title: "这是测试标题",
    fields: ["测试一","测试二","测试三","测试四","测试五"],
  },
}