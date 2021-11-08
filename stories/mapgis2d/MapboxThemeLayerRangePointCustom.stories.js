import wuhan_house from "../assets/geojson/wuhan_house"

export default {
    title: "二维/图层/专题图/分段专题图自定义分段/点数据",
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
            description:  "专题图样式，包含专题图图层样式、分段样式以及高亮样式，样式如下：<br>" +
                "1、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式<br>" +
                "有如下值：<br>" +
                "1.1、<span class='storybook-span'>color</span>：渐变颜色，例如：#9999FF,#99FFFF,#FF9999,#FFFF99<br>" +
                "1.2、<span class='storybook-span'>opacity</span>：透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>" +
                "1.3、<span class='storybook-span'>outlineWidth</span>：多边形外边线宽度，默认为1<br>" +
                "1.4、<span class='storybook-span'>outlineColor</span>：多边形外边线颜色，16进制或rgb颜色，默认为#000000<br>" +
                "1.5、<span class='storybook-span'>outlineOpacity</span>：多边形外边线透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明" +
                "2、<span class='storybook-span'>styleGroups</span>(选填)：分段样式数组，每一个子对象，表示一个分段样式<br>" +
                "有如下值：<br>" +
                "2.1、<span class='storybook-span'>start</span>：分段起始值<br>" +
                "2.2、<span class='storybook-span'>end</span>：分段结束值<br>" +
                "2.3、<span class='storybook-span'>style</span>：分段样式<br>" +
                "有如下值：<br>" +
                "2.3.1、<span class='storybook-span'>color</span>：填充颜色，十六进制或rgb颜色<br>" +
                "2.3.2、<span class='storybook-span'>radius</span>：点的半径，默认为6<br>" +
                "2.3.3、<span class='storybook-span'>opacity</span>：点的透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>" +
                "2.3.4、<span class='storybook-span'>outlineWidth</span>：点的外边线宽度，默认为1<br>" +
                "2.3.5、<span class='storybook-span'>outlineColor</span>：点的外边线颜色，默认为#000000，十六进制或rgb颜色<br>" +
                "2.3.6、<span class='storybook-span'>outlineOpacity</span>：点的外边线透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明" +
                "3、<span class='storybook-span'>layerStyle</span>(选填)：高亮样式(略)",
            table:{
                defaultValue: { summary: 'null' },
            }
        }
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    methods: {},
    template: `
      <mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
      <mapgis-theme-layer-custom v-bind="$props"/>
      </mapgis-web-map>`,
});

export const 定义单个分段样式 = Template.bind({});
定义单个分段样式.args = {
    dataSource: wuhan_house,
    type: "range",
    field: "display_x",
    themeOptions: {
        layerStyle: {
            color: "#3D5941,#778868,#B5B991,#F6EDBD,#EDBB8A,#DE8A5A,#CA562C",
            radius: 10
        },
        styleGroups: [{
            start: 114,
            end: 114.3,
            style: {
                color: "#FF0000",
                radius: 4,
                opacity: 0.5,
                outlineWidth: 2,
                outlineColor: "#FFFF00",
                outlineOpacity: 0.5
            }
        }]
    }
}
