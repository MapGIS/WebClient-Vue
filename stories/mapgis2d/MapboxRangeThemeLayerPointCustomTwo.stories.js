import wuhan_house from "../assets/geojson/wuhan_house"

export default {
    title: "二维/图层/专题图/分段专题图自定义样式/定义单个分段样式/点",
    argTypes: {
        type: {
            description: "专题图类型，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
            table: {
                defaultValue: {summary: 'range'},
            },
        },
        field: {
            description: "专题图字段，请填写仅含有数字的字段",
            table: {
                defaultValue: {summary: 'null'},
            },
        },
        dataSource: {
            description: "geojson格式的数据源",
            table: {
                defaultValue: {summary: 'null'},
            },
        },
        layerStyle: {
            description: "专题图整体样式",
            table: {
                defaultValue: {summary: 'null'},
            }
        },
        styleGroups: {
            description: "styleGroups为一个对象数组，每一个对象会定义一个分段的样式<br>分段值如下所示：<br>" +
                "1、<span class='storybook-span'>start</span>：分段起始值<br>" +
                "2、<span class='storybook-span'>end</span>：分段结束值<br>" +
                "分段样式，如下所示：<br>" +
                "1、<span class='storybook-span'>color</span>：填充颜色，十六进制或rgb颜色<br>" +
                "2、<span class='storybook-span'>radius</span>：点的半径，默认为6<br>" +
                "3、<span class='storybook-span'>opacity</span>：点的透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>" +
                "4、<span class='storybook-span'>outlineWidth</span>：点的外边线宽度，默认为1<br>" +
                "5、<span class='storybook-span'>outlineColor</span>：点的外边线颜色，默认为#000000，十六进制或rgb颜色<br>" +
                "6、<span class='storybook-span'>outlineOpacity</span>：点的外边线透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明",
            table: {
                defaultValue: {summary: 'null'},
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
    data() {
        return {}
    },
    mounted() {
        console.log("props", this.$props)
    }
});

export const 定义单个分段样式 = Template.bind({});
定义单个分段样式.args = {
    type: "range",
    field: "display_x",
    dataSource: wuhan_house,
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
