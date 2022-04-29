export default {
  title: "界面/反馈/通知提醒框",
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
        },
        duration: 0
      });
    },
    openNotificationWithIcon(type) {
      this.$notification[type]({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    },
  },
  template: `
  <div>
    <mapgis-ui-button type="primary" v-on:click="openNotification">
      Open the notification box
    </mapgis-ui-button>
    <mapgis-ui-button @click="() => openNotificationWithIcon('success')">
      Success
    </mapgis-ui-button>
    <mapgis-ui-button @click="() => openNotificationWithIcon('info')">
      Info
    </mapgis-ui-button>
    <mapgis-ui-button @click="() => openNotificationWithIcon('warning')">
      Warning
    </mapgis-ui-button>
    <mapgis-ui-button @click="() => openNotificationWithIcon('error')">
      Error
    </mapgis-ui-button>
  </div>
  `,
});

export const Notification = Template.bind({});
Notification.args = {};
