import MapgisUiMenu from "../../../ui/src/components/menu/Menu.vue";

export default {
  title: "界面/导航/导航菜单",
  component: MapgisUiMenu,
  argTypes: {
    mode: "vertical",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiMenu },
  data() {
    return {
      current: ["mail"],
    };
  },
  template: `<mapgis-ui-menu v-model="current" :mode="mode">
      <mapgis-ui-menu-item key="mail"> <mapgis-ui-icon type="mail" />导航菜单一</mapgis-ui-menu-item>
      <mapgis-ui-menu-item key="app" disabled> <mapgis-ui-icon type="appstore" />导航菜单二-禁用</mapgis-ui-menu-item>
      <mapgis-ui-sub-menu>
        <span slot="title" class="submenu-title-wrapper">导航菜单三 - 子菜单</span>
        <mapgis-ui-menu-item-group title="Item 1">
          <mapgis-ui-menu-item key="setting:1">
            Option 1
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item key="setting:2">
            Option 2
          </mapgis-ui-menu-item>
        </mapgis-ui-menu-item-group>
        <mapgis-ui-menu-item-group title="Item 2">
          <mapgis-ui-menu-item key="setting:3">
            Option 3
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item key="setting:4">
            Option 4
          </mapgis-ui-menu-item>
        </mapgis-ui-menu-item-group>
      </mapgis-ui-sub-menu>
      <mapgis-ui-menu-item key="alipay">
        <a href="https//develop.smaryun.com" target="_blank" rel="noopener noreferrer"
          >导航菜单四 - 链接</a
        >
      </mapgis-ui-menu-item>
    </mapgis-ui-menu>`,
});

export const 水平 = Template.bind({});
水平.args = {
  mode: "horizontal",
};

const TemplateInline = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiMenu },
  data() {
    return {
      current: ["mail"],
    };
  },
  template: `<mapgis-ui-menu v-model="current" :mode="mode" style="width:256px;">
      <mapgis-ui-menu-item key="mail"> <mapgis-ui-icon type="mail" />导航菜单一</mapgis-ui-menu-item>
      <mapgis-ui-menu-item key="app" disabled> <mapgis-ui-icon type="appstore" />导航菜单二-禁用</mapgis-ui-menu-item>
      <mapgis-ui-sub-menu>
        <span slot="title" class="submenu-title-wrapper">导航菜单三 - 子菜单</span>
        <mapgis-ui-menu-item-group title="Item 1">
          <mapgis-ui-menu-item key="setting:1">
            Option 1
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item key="setting:2">
            Option 2
          </mapgis-ui-menu-item>
        </mapgis-ui-menu-item-group>
        <mapgis-ui-menu-item-group title="Item 2">
          <mapgis-ui-menu-item key="setting:3">
            Option 3
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item key="setting:4">
            Option 4
          </mapgis-ui-menu-item>
        </mapgis-ui-menu-item-group>
      </mapgis-ui-sub-menu>
      <mapgis-ui-menu-item key="alipay">
        <a href="https//develop.smaryun.com" target="_blank" rel="noopener noreferrer"
          >导航菜单四 - 链接</a
        >
      </mapgis-ui-menu-item>
    </mapgis-ui-menu>`,
});

export const 垂直 = TemplateInline.bind({});
垂直.args = {
  mode: "vertical",
};

export const 内联 = TemplateInline.bind({});
内联.args = {
  mode: "inline",
};
