import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/HeightLimited.md";

export default {
    title: "三维/三维分析/模型分析",
    argTypes: {
        color: {
            //描述信息，即页面上Description那一栏的值
            description: '分析时显示颜色',
            table: {
                //description描述信息下的提示框，可选，添加这一项就会在描述信息文字下生成一个提示信息按钮
                //summary：提示按钮里的文字，detail：提示信息
                type: {summary: 'tips', detail: "CSS的十六进制/rgb/rgba"},
                //默认值，即页面上Default那一栏的值，不在这里填写，则页面上不会有默认值
                //如果加了detail,{ summary: 'null',detail: "这里是提示" },则页面会多出一个描述信息的提示框
                defaultValue: {summary: 'rgba(255,0,0,0.5)'},
            },
            //Control这里一栏里面展示数据的方式，可以是input、textArean、boolean等，可选值如下
            control: 'text'
        },
        drawStyle: {
            description: '绘制控高区域时的绘制样式',
            table: {
                type: {summary: 'tips', detail: "绘制样式的color属性是CSS十六进制"},
                defaultValue: {
                    summary: '{\n' +
                        '          color: "#FF8C00",\n' +
                        '          opacity: 0.6\n' +
                        '        }'
                },
            }
        },
        heightLimit: {
            description: '默认控高分析的高度',
            table: {
                defaultValue: {
                    summary: 80
                }
            },
            control: 'number'
        },
        maxSliderHeight: {
            description: '控高滑动条最大值',
            table: {
                defaultValue: {
                    summary: 80
                }
            },
            control: 'number'
        },
        minSliderHeight: {
            description: '控高滑动条最小值',
            table: {
                defaultValue: {
                    summary: 80
                }
            },
            control: 'number'
        },
    }
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url:
                "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            autoReset: true,
            maximumScreenSpaceError: 8,
        }
    },
    template: `
      <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-raster-layer :url="url"></mapgis-3d-raster-layer>
      <mapgis-3d-m3d-layer
          :url="m3dUrl1"
          :autoReset="autoReset"
      />
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-heightlimited :color="heightLimitColor"
                                 :heightLimit='heightLimit'
                                 :maxSliderHeight='maxSliderHeight'
                                 :minSliderHeight='minSliderHeight'
                                 :drawStyle='drawStyle'
                                 @load='load'>
        </mapgis-3d-heightlimited>
      </mapgis-ui-card>
      <mapgis-3d-statebar></mapgis-3d-statebar>
      </mapgis-web-scene>
    `,
    methods:{
        load(e){
            this.heightLimitedAnalysis = e
        }
    }
});

export const 控高 = Template.bind({});
控高.args = {
    heightLimitColor: "rgba(255,0,0,0.5)",
    drawStyle: {
        color: "#FF8C00",
        opacity: 0.6
    },
    heightLimit: 80,
    maxSliderHeight: 180,
    minSliderHeight: 0,
    m3dUrl1: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/ZondyModels`
}
控高.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};
