export default {
  title: "界面/通知提醒框",
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
    };
  },
  methods: {
    openNotification() {
      this.$notification.open({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        onClick: () => {
          console.log('Notification Clicked!');
        }
      });
    }
  },
  template: `
  <mapgis-ui-button type="primary" v-on:click="openNotification">
    Open the notification box
  </mapgis-ui-button>
  `,
});

export const Notification = Template.bind({});
Notification.args = {};
