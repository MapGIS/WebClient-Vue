export default {
  title: "界面/反馈/警告提示",
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  methods: {
    handleClose() {
      console.warn('关闭')
    }
  },
  template: `<div>
    <mapgis-ui-alert
      message="Very long warning text warning text text text text text text text"
      banner
      closable
      @close="handleClose"
    />
    <mapgis-ui-alert message="Success Tips" type="success" show-icon />
    <mapgis-ui-alert message="Informational Notes" type="info" show-icon />
    <mapgis-ui-alert message="Warning" type="warning" show-icon />
    <mapgis-ui-alert message="Error" type="error" show-icon />
    <mapgis-ui-alert
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      type="success"
      show-icon
    />
    <mapgis-ui-alert
      message="Informational Notes"
      description="Additional description and informations about copywriting."
      type="info"
      show-icon
    />
    <mapgis-ui-alert
      message="Warning"
      description="This is a warning notice about copywriting."
      type="warning"
      show-icon
    />
    <mapgis-ui-alert
      message="Error"
      description="This is an error message about copywriting."
      type="error"
      show-icon
    />
  </div>`,
});

export const 警告提示 = Template.bind({});
警告提示.args = {};
