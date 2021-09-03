import MapgisUiEmpty from "../../../ui/src/components/empty/Empty.vue";

export default {
  title: "界面/数据显示/空状态",
  component: MapgisUiEmpty,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiEmpty },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-empty
      image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
      :image-style="{
      height: '60px',
      }"
  >
      <span slot="description"> Customize <a href="#">Description</a> </span>
      <mapgis-ui-button type="primary">
        Create Now
      </mapgis-ui-button>
  </mapgis-ui-empty>
  `,
});

export const Empty = Template.bind({});
Empty.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiEmpty },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-empty :description="false"/>
  `,
});

export const NoDescriptionEmpty = Template2.bind({});
NoDescriptionEmpty.args = {};
