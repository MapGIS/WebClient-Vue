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
      vueKey: "default",
      vueIndex: 100,
      M3DsArr: [],
      //不嵌入一张图时的ui处理，可忽略
      noOneMapFlag: true,
    };
  },
  mounted() {
    this.M3DsArr = [
      {
        key: this.vueIndex,
        value: "中地大楼",
      },
    ];
  },
  template: `
      <mapgis-web-scene style="height: 95vh">
          
          <mapgis-3d-m3d-layer
          v-if="modelType === 'm3d'"
          :url="m3dUrl1"
        />
        <mapgis-3d-scene-layer 
              v-else
              :vueKey="vueKey" 
              :vueIndex="vueIndex" 
              :autoReset="autoReset" 
              :maximumScreenSpaceError="maximumScreenSpaceError" 
              :url="m3dUrl" 
          />
          <mapgis-ui-card customPosition="top-left" class="storybook-ui-card">
            <mapgis-3d-terrain-aspect
           :modelType="modelType"
        />
          </mapgis-ui-card>
      </mapgis-web-scene>
      `,
});

export const 开挖 = Template.bind({});
开挖.args = {
  //   modelType: "m3d",
  //   m3dUrl1: `http://${window.webclient.igsIp}:${window.webclient.filePort}/3DData/ModelCache/M3D/1.0/钻孔_2_钻孔模型s/钻孔_2_钻孔模型s.mcj`,
  m3dUrl1: `http://${window.webclient.igsIp}:${window.webclient.filePort}/3DData/ModelCache/M3D/1.0/钻孔分层点_Sur_000_Ent/钻孔分层点_Sur_000_Ent.mcj`,
  m3dUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:ZondyModels`,
};
