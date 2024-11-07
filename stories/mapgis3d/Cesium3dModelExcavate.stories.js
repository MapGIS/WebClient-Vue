export default {
  title: "三维/三维分析/模型分析",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url:
        "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      autoReset: true,
      maximumScreenSpaceError: 8,
    };
  },
  mounted() {
  },
  template: `
      <mapgis-web-scene style="height: 95vh">
        <mapgis-3d-scene-layer 
              :vueIndex="$props.models[0].vueIndex" 
              :autoReset="autoReset" 
              :maximumScreenSpaceError="maximumScreenSpaceError" 
              :url="m3dUrl" 
          />
          <mapgis-ui-card customPosition="top-left" class="storybook-ui-card">
            <mapgis-3d-excavate-analysis
           :models="models"
        />
          </mapgis-ui-card>
      </mapgis-web-scene>
      `,
});

export const 开挖 = Template.bind({});
开挖.args = {
  models: [
    {
      vueIndex: 1,
      title: "中地大楼",
    }
  ],
  m3dUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:ZondyModels`,
};
