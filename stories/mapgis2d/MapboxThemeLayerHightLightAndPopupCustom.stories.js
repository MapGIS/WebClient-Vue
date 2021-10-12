import wuhan from "../assets/geojson/wuhan"

export default {
    title: "二维/图层/专题图/开启Tips和Popup/自定义",
    argTypes: {
        dataSource: {
            description: "geojson格式的数据源，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
            table: {
                defaultValue: {summary: 'null'},
            },
        },
        type: {
            description: "<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
            table: {
                defaultValue: {summary: 'null'},
            },
        },
        field: {
            description: "<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图",
            table: {
                defaultValue: {summary: 'null'},
            },
        },
        enableTips: {
            description: "是否开启Tips，默认不开启，Tips是指当鼠标移动到某一个要素内时，会弹出一个窗口，显示要素信息",
            table: {
                defaultValue: {summary: 'false'},
            },
        },
        tipsOptions: {
            description: "Tips对象的配置参数，如下所示：<br>" +
                "1、<span class='storybook-span'>anchor</span>(选填)：锚点，即鼠标相对于Tips的位置，默认值为'bottom'，有如可选下值：'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' ,'bottom-right'<br>" +
                "2、<span class='storybook-span'>offset</span>(选填)：相对偏移，即Tips相对鼠标偏移量，有数字(例如10)和数组(例如[10,10])两种方式，<br>" +
                "<span class='storybook-span'>当偏移量为一个数字X(例如10)时</span>，表示Tips在锚点(anchor)所定义的方向上相对鼠标进行偏移X(例如10)像素;<br>" +
                "<span class='storybook-span'>当偏移量为一个数组'[x,y]'(例如[10,10])时</span>，表示Tips相对鼠标进行[10(像素/X轴),10(像素/Y轴)]偏移;<br>" +
                "3、<span class='storybook-span'>maxWidth</span>(选填)：Tips的最大宽度， 默认值'240px'<br>" +
                "4、<span class='storybook-span'>fields</span>(选填)：Tips中要显示的字段， 默认值为[]，当不指定要显示的字段时，则会使用field所表示的字段作为默认字段<br>" +
                "5、<span class='storybook-span'>alias</span>(选填)：Tips中要显示的字段的别名，一个键值对对象，会将字段名替换为别名<br>" +
                "6、<span class='storybook-span'>title</span>(选填)：标题<br>" +
                "7、<span class='storybook-span'>style</span>(选填)：定义Tips中一行的整体样式，规则与css规则一致，有如下值：<br>" +
                "7.1、<span class='storybook-span'>containerStyle</span>(选填)：容器样式<br>" +
                "7.2、<span class='storybook-span'>rowStyle</span>(选填)：一行数据的整体样式<br>" +
                "7.3、<span class='storybook-span'>titleStyle</span>(选填)：标题样式<br>" +
                "7.4、<span class='storybook-span'>fieldStyle</span>(选填)：字段名样式<br>" +
                "7.5、<span class='storybook-span'>valueStyle</span>(选填)：字段值样式<br>" +
                "8、<span class='storybook-span'>class</span>(选填)：定义Tips中的class，以空格区分多个class，有如下值：<br>" +
                "8.1、<span class='storybook-span'>containerClass</span>(选填)：定义Tips中容器的class<br>" +
                "8.2、<span class='storybook-span'>rowClass</span>(选填)：定义Tips中一行的class：<br>" +
                "8.3、<span class='storybook-span'>titleClass</span>(选填)：定义Tips中标题的class，有如下值：<br>" +
                "8.4、<span class='storybook-span'>fieldClass</span>(选填)：定义Tips中字段名的class，有如下值：<br>" +
                "8.5、<span class='storybook-span'>valueClass</span>(选填)：定义Tips中字段值的class，有如下值：<br>" +
                "9、<span class='storybook-span'>enableHighlight</span>(选填)：当鼠标移动到要素上时，是否显示高亮，默认为false不显示高亮<br>" +
                "10、<span class='storybook-span'>highlightStyle</span>(选填)：高亮样式<br>" +
                "有如下值：<br>" +
                "10.1、<span class='storybook-span'>lineStyle</span>：高亮图层的外边线样式：<br>" +
                "有如下值：<br>" +
                "10.1.1、<span class='storybook-span'>color</span>：高亮图层的外边线颜色，十六进制或rgb颜色<br>" +
                "10.1.2、<span class='storybook-span'>width</span>：高亮图层的外边线宽度<br>" +
                "10.1.3、<span class='storybook-span'>opacity</span>：高亮图层的外边透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
                "10.2、<span class='storybook-span'>fillStyle</span>：高亮图层的填充区域样式<br>" +
                "有如下值：<br>" +
                "10.2.1、<span class='storybook-span'>color</span>：高亮图层的填充区域颜色，十六进制或rgb颜色<br>" +
                "10.2.2、<span class='storybook-span'>opacity</span>：高亮图层的填充区域透明度，0~1之间的值，0表示透明，1表示不透明<br>",
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
        popupOptions: {
            description: "Popup对象的配置参数，如下所示：<br>" +
                "1、<span class='storybook-span'>anchor</span>(选填)：锚点，即鼠标相对于Tips的位置，默认值为'bottom'，有如可选下值：'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' ,'bottom-right'<br>" +
                "2、<span class='storybook-span'>offset</span>(选填)：相对偏移，即Tips相对鼠标偏移量，有数字(例如10)和数组(例如[10,10])两种方式，<br>" +
                "<span class='storybook-span'>当偏移量为一个数字X(例如10)时</span>，表示Tips在锚点(anchor)所定义的方向上相对鼠标进行偏移X(例如10)像素;<br>" +
                "<span class='storybook-span'>当偏移量为一个数组'[x,y]'(例如[10,10])时</span>，表示Tips相对鼠标进行[10(像素/X轴),10(像素/Y轴)]偏移;<br>" +
                "3、<span class='storybook-span'>maxWidth</span>(选填)：Tips的最大宽度， 默认值'240px'<br>" +
                "4、<span class='storybook-span'>closeButton</span>(选填)：是否在右上角显示关闭Popup的按钮，默认值为true<br>" +
                "5、<span class='storybook-span'>closeOnMove</span>(选填)：是否在移动地图时示关闭Popup，默认值为false<br>" +
                "6、<span class='storybook-span'>fields</span>(选填)：Tips中要显示的字段， 默认值为[]，当不指定要显示的字段时，则会使用field所表示的字段作为默认字段<br>" +
                "7、<span class='storybook-span'>alias</span>(选填)：Tips中要显示的字段的别名，一个键值对对象，会将字段名替换为别名<br>" +
                "8、<span class='storybook-span'>title</span>(选填)：标题<br>" +
                "9、<span class='storybook-span'>style</span>(选填)：定义Popup中的整体样式，规则与css规则一致，有如下值：<br>" +
                "9.1、<span class='storybook-span'>containerStyle</span>(选填)：容器样式<br>" +
                "9.2、<span class='storybook-span'>rowStyle</span>(选填)：一行数据的整体样式<br>" +
                "9.3、<span class='storybook-span'>titleStyle</span>(选填)：标题样式<br>" +
                "9.4、<span class='storybook-span'>fieldStyle</span>(选填)：字段名样式<br>" +
                "9.5、<span class='storybook-span'>valueStyle</span>(选填)：字段值样式<br>" +
                "10、<span class='storybook-span'>class</span>(选填)：定义Popup中的class，以空格区分多个class，有如下值：<br>" +
                "10.1、<span class='storybook-span'>containerClass</span>(选填)：定义Popup中容器的class<br>" +
                "10.2、<span class='storybook-span'>rowClass</span>(选填)：定义Popup中一行的class：<br>" +
                "10.3、<span class='storybook-span'>titleClass</span>(选填)：定义Popup中标题的class，有如下值：<br>" +
                "10.4、<span class='storybook-span'>fieldClass</span>(选填)：定义Popup中字段名的class，有如下值：<br>" +
                "10.5、<span class='storybook-span'>valueClass</span>(选填)：定义Popup中字段值的class，有如下值：<br>" +
                "11、<span class='storybook-span'>enableHighlight</span>(选填)：当鼠标移动到要素上时，是否显示高亮，默认为false不显示高亮<br>" +
                "12、<span class='storybook-span'>highlightStyle</span>(选填)：高亮样式<br>" +
                "有如下值：<br>" +
                "12.1、<span class='storybook-span'>lineStyle</span>：高亮图层的外边线样式：<br>" +
                "有如下值：<br>" +
                "12.1.1、<span class='storybook-span'>color</span>：高亮图层的外边线颜色，十六进制或rgb颜色<br>" +
                "12.1.2、<span class='storybook-span'>width</span>：高亮图层的外边线宽度<br>" +
                "12.1.3、<span class='storybook-span'>opacity</span>：高亮图层的外边透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
                "12.2、<span class='storybook-span'>fillStyle</span>：高亮图层的填充区域样式<br>" +
                "有如下值：<br>" +
                "12.2.1、<span class='storybook-span'>color</span>：高亮图层的填充区域颜色，十六进制或rgb颜色<br>" +
                "12.2.2、<span class='storybook-span'>opacity</span>：高亮图层的填充区域透明度，0~1之间的值，0表示透明，1表示不透明<br>",
            table: {
                defaultValue: {summary: 'false'},
            },
        },
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

export const 开启Tips和Popup = Template.bind({});
开启Tips和Popup.args = {
    dataSource: wuhan,
    type: "range",
    field: "adcode",
    enableTips: true,
    tipsOptions: {
        anchor: "top-left",
        offset: 20,
        maxWidth: "400px",
        title: "这是一个标题",
        fields: [
            "name",
            "adcode",
            "center",
        ],
        alias: {
            "name": "行政区名",
            "adcode": "邮政编码",
            "center": "中心点",
        },
        style: {
            containerStyle: {},
            rowStyle: {},
            titleStyle: {},
            fieldStyle: {},
            valueStyle: {}
        },
        class: {
            containerClass: "",
            rowClass: "",
            titleClass: "",
            fieldClass: "",
            valueClass: ""
        },
        enableHighlight: true,
        highlightStyle: {
            lineStyle: {
                color: "#FF0000",
                width: 4,
                opacity: 1
            },
            fillStyle: {
                color: "#0000FF",
                opacity: 0.5
            }
        }
    },
    enablePopup: true,
    popupOptions: {
        anchor: "bottom",
        offset: 20,
        maxWidth: "400px",
        closeButton: true,
        closeOnMove: false,
        fields: [
            "name",
            "adcode",
            "center",
        ],
        alias: {
            "name": "行政区名",
            "adcode": "邮政编码",
            "center": "中心点",
        },
        style: {
            containerStyle: {},
            rowStyle: {},
            titleStyle: {
                color: "blue"
            },
            fieldStyle: {
                color: "red"
            },
            valueStyle: {
                color: "#FF00FF"
            }
        },
        class: {
            containerClass: "mapgis-container-popup",
            rowClass: "",
            titleClass: "",
            fieldClass: "",
            valueClass: ""
        },
        enableHighlight: true,
        highlightStyle: {
            lineStyle: {
                color: "#FF0000",
                width: 4,
                opacity: 1
            },
            fillStyle: {
                color: "#0000FF",
                opacity: 0.5
            }
        }
    },
}
