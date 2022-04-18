import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Skyline.md";

export default {
    title: "三维/分析/天际线分析",
    argTypes: {
        skylineWidth: {
            //描述信息，即页面上Description那一栏的值
            description: '天际线分析结果的宽度',
            table: {
                defaultValue: {summary: '2'},
            },
            control: 'number'
        },
        skylineColor: {
            description: '天际线分析结果的颜色',
            table: {
                defaultValue: {summary: 'rgb(255,0,0)'},
            },
            control: 'color'
        }
    }
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
            autoReset: true,
            maximumScreenSpaceError: 8,
            skyline2dChart: null,
            skyline2dVisible: false,
            skyLineAnalysis: null
        }
    },
    template: `
      <mapgis-web-scene style="height:95vh">
      <mapgis-3d-raster-layer :url="url"/>
      <mapgis-3d-m3d-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"/>
      <mapgis-ui-card customPosition="top-left" class="storybook-ui-card">
        <mapgis-3d-skyline
            :skylineWidth='skylineWidth'
            :skylineColor='skylineColor'
            @load='load'
            @remove='remove'
            @showAnalysis2d='showAnalysis2d'>
        </mapgis-3d-skyline>
      </mapgis-ui-card>
      <!--      <mapgis-window-wrapper :visible='skyline2dVisible'>-->
      <mapgis-ui-window
          @window-size='onSkyline2dWindowSize'
          :visible.sync='skyline2dVisible'
          :min-width='300'
          :max-height='300'
          anchor='bottom-left'
          title='二维天际线'
      >
        <div ref='skyline2dChart'>
          <div id='skyline-2d-chart' style="width:300px;height:230px"/>
        </div>
      </mapgis-ui-window>
      <!--      </mapgis-window-wrapper>-->
      </mapgis-web-scene>
    `,
    methods: {
        /**
         * 二维天际线图表弹框size变化
         * @param mode
         */
        onSkyline2dWindowSize(mode) {
            this.$nextTick(() => {
                if (this.skyline2dChart) {
                    const width =
                        mode === 'max' ? this.$refs.skyline2dChart.clientWidth : 300
                    this.skyline2dChart.resize({width})
                }
            })
        },
        remove() {
            this.hideAnalysis2d()
        },

        load(skyLineAnalysis) {
            this.skyLineAnalysis = skyLineAnalysis
        },

        /**
         * 展示二维天际线
         * todo 绘制完成回调添加二维坐标点 #143
         */
        showAnalysis2d(skyline2dChart) {
            this.skyline2dVisible = true;
            this.skyline2dChart = skyline2dChart;
        },

        /**
         * 隐藏二维天际线
         */
        hideAnalysis2d() {
            this.skyline2dVisible = false
        }
    }
});

export const Skyline = Template.bind({});
Skyline.args = {
    skylineWidth: 2,
    skylineColor: 'rgb(255,0,0)',
}
Skyline.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};