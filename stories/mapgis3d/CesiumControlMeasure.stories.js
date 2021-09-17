import Mapgis3dMeasure from "../../cesium/src/components/UI/Controls/Measure/MeasureStory.vue";

export default {
  title: "三维/场景子组件/量测",
  component: Mapgis3dMeasure,
  argTypes: {
    enableControl: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { "mapgis-3d-measure": Mapgis3dMeasure },
  template: `
    <mapgis-web-scene
      v-bind:animation="false"
      v-bind:timeline="false">
      <mapgis-3d-igs-m3d :url="m3durl"> </mapgis-3d-igs-m3d>
      <mapgis-3d-measure v-bind="$props" />
    </mapgis-web-scene>
  `,
  data() {
    return {
      m3durl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
    };
  },
});

export const MeasureTool = Template.bind({});
MeasureTool.args = {
  enableControl: true,
};
