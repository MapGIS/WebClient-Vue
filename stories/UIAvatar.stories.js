import MapgisUiAvatar from "../ui/src/components/avatar/Avatar.vue";

export default {
  title: "界面/头像",
  component: MapgisUiAvatar,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiAvatar },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <div>
      <mapgis-ui-avatar :size="64" icon="user" />
      <mapgis-ui-avatar size="large" icon="user" />
      <mapgis-ui-avatar icon="user" />
      <mapgis-ui-avatar size="small" icon="user" />
    </div>
    <br />
    <div>
      <mapgis-ui-avatar shape="square" :size="64" icon="user" />
      <mapgis-ui-avatar shape="square" size="large" icon="user" />
      <mapgis-ui-avatar shape="square" icon="user" />
      <mapgis-ui-avatar shape="square" size="small" icon="user" />
    </div>
  </div>
  `,
});

export const Avatar = Template.bind({});
Avatar.args = {};
