export default {
  title: "三维/三维分析/模型分析/模型压平",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url:
        "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      m3dUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/ZondyModels`,
      autoReset: true,
      maximumScreenSpaceError: 8,
      vueKey: "default",
      vueIndex: 100,
      M3DsArr: [],
      //不嵌入一张图时的ui处理，可忽略
      noOneMapFlag: true
    };
  },
  mounted() {
    this.M3DsArr = [{
      key: this.vueIndex,
      value: "中地大楼"
    }];
  },
  template: `
    <mapgis-web-scene style="height: 95vh">
<!--        <mapgis-3d-raster-layer :url="url" />-->
        <mapgis-3d-m3d-layer 
            :vueKey="vueKey" 
            :vueIndex="vueIndex" 
            :autoReset="autoReset" 
            :maximumScreenSpaceError="maximumScreenSpaceError" 
            :url="m3dUrl" 
        />
        <mapgis-ui-card customPosition="top-left" class="storybook-ui-card">
          <mapgis-3d-model-flatten
              :vueKey="vueKey" 
              :vueIndex="vueIndex"
              :M3Ds="M3DsArr"
              :noOneMap="noOneMapFlag"
          >
          </mapgis-3d-model-flatten>
        </mapgis-ui-card>
    </mapgis-web-scene>
    `,
});

export const 模型压平 = Template.bind({});
模型压平.args = {};
