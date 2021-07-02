import MapgisUiTag from "../ui/src/components/tag/Tag.vue";

export default {
  title: "界面/标签",
  component: MapgisUiTag,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTag },
  data() {
    return {
    };
  },
  methods: {
    log(e) {
      console.log(e);
    },
    preventDefault(e) {
      e.preventDefault();
      console.log('Clicked! But prevent default.');
    },
  },
  template: `
  <div>
    <mapgis-ui-tag>Tag 1</mapgis-ui-tag>
    <mapgis-ui-tag><a href="https://github.com/vueComponent/ant-design">Link</a></mapgis-ui-tag>
    <mapgis-ui-tag closable @close="log">
      Tag 2
    </mapgis-ui-tag>
    <mapgis-ui-tag closable @close="preventDefault">
      Prevent Default
    </mapgis-ui-tag>
  </div>
  `,
});

export const Tag = Template.bind({});
Tag.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTag },
  data() {
    return {
    };
  },
  methods: {
    log(e) {
      console.log(e);
    },
    preventDefault(e) {
      e.preventDefault();
      console.log('Clicked! But prevent default.');
    },
  },
  template: `
  <div>
    <h4 style="margin-bottom: 16px">
      Presets:
    </h4>
    <div>
      <mapgis-ui-tag color="pink">
        pink
      </mapgis-ui-tag>
      <mapgis-ui-tag color="red">
        red
      </mapgis-ui-tag>
      <mapgis-ui-tag color="orange">
        orange
      </mapgis-ui-tag>
      <mapgis-ui-tag color="green">
        green
      </mapgis-ui-tag>
      <mapgis-ui-tag color="cyan">
        cyan
      </mapgis-ui-tag>
      <mapgis-ui-tag color="blue">
        blue
      </mapgis-ui-tag>
      <mapgis-ui-tag color="purple">
        purple
      </mapgis-ui-tag>
    </div>
    <h4 style="margin: '16px 0'">
      Custom:
    </h4>
    <div>
      <mapgis-ui-tag color="#f50">
        #f50
      </mapgis-ui-tag>
      <mapgis-ui-tag color="#2db7f5">
        #2db7f5
      </mapgis-ui-tag>
      <mapgis-ui-tag color="#87d068">
        #87d068
      </mapgis-ui-tag>
      <mapgis-ui-tag color="#108ee9">
        #108ee9
      </mapgis-ui-tag>
    </div>
  </div>
  `,
});

export const ProductTag = Template2.bind({});
ProductTag.args = {};