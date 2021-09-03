export default {
  title: "界面/全局提示",
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  methods: {
    info() {
      this.$message.info("This is a normal message");
    },
  },
  template: `<mapgis-ui-button type="primary" @click="info">
    Display normal message
  </mapgis-ui-button>`,
});

export const 普通提示 = Template.bind({});
普通提示.args = {};
