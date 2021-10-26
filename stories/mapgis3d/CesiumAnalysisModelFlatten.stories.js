export default {
  title: "三维/分析/模型压平",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url:
        "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
      autoReset: true,
      maximumScreenSpaceError: 8,
      vueKey: "default",
      vueIndex: 100,
    };
  },
  template: `
    <mapgis-web-scene>
        <mapgis-3d-raster-layer :url="url" />
        <mapgis-3d-igs-m3d 
            :vueKey="vueKey" 
            :vueIndex="vueIndex" 
            :autoReset="autoReset" 
            :maximumScreenSpaceError="maximumScreenSpaceError" 
            :url="m3dUrl" 
        />
        
        <mapgis-3d-modelflatten 
            :vueKey="vueKey" 
            :vueIndex="vueIndex"
        >
        </mapgis-3d-modelflatten>
    </mapgis-web-scene>
    `,
});

export const 模型压平 = Template.bind({});
模型压平.args = {};
