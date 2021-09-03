import MapgisUiDivider from "../../../ui/src/components/divider/Divider.vue";

export default {
  title: "界面/分割线",
  component: MapgisUiDivider,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDivider },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    Text
    <mapgis-ui-divider type="vertical" />
    <a href="#">Link</a>
    <mapgis-ui-divider type="vertical" />
    <a href="#">Link</a>
  </div>
  `,
});

export const Divider = Template.bind({});
Divider.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDivider },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <mapgis-ui-divider>Text</mapgis-ui-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <mapgis-ui-divider orientation="left">
      Left Text
    </mapgis-ui-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <mapgis-ui-divider orientation="right">
      Right Text
    </mapgis-ui-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </div>
  `,
});

export const DividerLineWithText = Template2.bind({});
DividerLineWithText.args = {};