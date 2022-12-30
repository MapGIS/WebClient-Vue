import Mapgis3dOutputImage from "../../cesium/src/components/UI/Controls/OutputImage/OutputImage.vue";
import Markdown from "../../cesium/docs/api/ui/outputimage.md";

export default {
  title: "三维/场景控制/场景",
  component: Mapgis3dOutputImage,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dOutputImage },
  template: `
  <mapgis-web-scene style="height:95vh">
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-output-image />
    </mapgis-ui-card>
  </mapgis-web-scene>
    `,
  data() {
    return {};
  },
});

export const 截图 = Template.bind({});
截图.args = {};
截图.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
