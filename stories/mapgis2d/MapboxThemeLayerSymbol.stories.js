import wuhan_house from "../assets/geojson/wuhan_house"

export default {
    title: "二维/图层/专题图/符号专题图",
    argTypes: {
        dataSource: {
            description: "geojson格式的数据源，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
            table:{
                defaultValue: { summary: 'null' },
            },
        },
        themeOption: {
            description:  "创建专题图所需要的参数，有如下值：<br>" +
                "1、<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)<br>" +
                "2、<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图<br>" +
                "3、<span class='storybook-span'>layerStyle</span>(选填)：等级符号专题图样式<br>" +
                "有如下值：<br>" +
                "1、<span class='storybook-span'>symbolSize</span>：符号半径<br>" +
                "2、<span class='storybook-span'>xOffset</span>：符号偏移(X轴方向)<br>" +
                "3、<span class='storybook-span'>yOffset</span>：符号偏移(Y轴方向)<br>" +
                "2、<span class='storybook-span'>opacity</span>：符号透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>",
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
      <mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" 
                      :zoom="8" 
                      :mapStyle="mapStyle" 
                      style="height:60vh"
      >
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
                glyphs: "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
            },
        }
    }
});

export const 自定义样式 = Template.bind({});
自定义样式.args = {
    dataSource: wuhan_house,
    themeOption: {
        type: "symbol",
        field: "display_x",
        layerStyle: {
            symbolSize: 0.2,
            xOffset: 10,
            yOffset: 10,
            opacity: 0.5
        }
    }
}

export const 默认样式 = Template.bind({});
默认样式.args = {
    dataSource: wuhan_house,
    themeOption: {
        type: "symbol",
        field: "display_x",
    }
}