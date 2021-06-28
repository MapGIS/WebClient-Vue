import MapgisUiDropdown from "../ui/src/components/dropdown/Dropdown.vue";

export default {
  title: "界面/下拉菜单",
  component: MapgisUiDropdown,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDropdown },
  data() {
    return {};
  },
  template: `<mapgis-ui-dropdown>
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
      Hover me <mapgis-ui-iconfont type="mapgis-tucengjiancheng" />
    </a>
  </mapgis-ui-dropdown>`,
});

export const Dropdown = Template.bind({});
Dropdown.args = {};
