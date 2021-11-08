import MapgisUiDropdown from "../../../ui/src/components/dropdown/Dropdown.vue";

export default {
  title: "界面/导航/下拉菜单",
  component: MapgisUiDropdown,
  argTypes: {
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiDropdown },
  data() {
    return {};
  },
  template: `<mapgis-ui-dropdown>
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
      鼠标移动到此处 <mapgis-ui-iconfont type="mapgis-down" />
    </a>
    <mapgis-ui-menu slot="overlay">
    <mapgis-ui-menu-item>
      <a href="javascript:;">菜单一</a>
    </mapgis-ui-menu-item>
    <mapgis-ui-menu-item>
      <a href="javascript:;">菜单二</a>
    </mapgis-ui-menu-item>
    <mapgis-ui-menu-item>
      <a href="javascript:;">菜单三</a>
    </mapgis-ui-menu-item>
  </mapgis-ui-menu>
  </mapgis-ui-dropdown>`,
});

export const Dropdown = Template.bind({});
Dropdown.args = {};
