import MapgisUiButton from "../../../ui/src/components/button/Button.vue";
import MapgisUiTooltipButton from "../../../ui/src/components/button/TooltipButton.vue";
import MarkDown from "../../../ui/docs/api/button/Button.md";
import Direction from "../../assets/direction.svg";

export default {
  title: "界面/通用/按钮",
  component: MapgisUiButton,
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
  components: { MapgisUiButton },
  data() {
    return {
    };
  },
  methods: {},
  template: `
  <template>
    <div>
      <mapgis-ui-button type="primary">
        Primary
      </mapgis-ui-button>
      <mapgis-ui-button>Default</mapgis-ui-button>
      <mapgis-ui-button type="dashed">
        Dashed
      </mapgis-ui-button>
      <mapgis-ui-button type="danger">
        Danger
      </mapgis-ui-button>
      <mapgis-ui-config-provider :auto-insert-space-in-button="true">
        <mapgis-ui-button type="primary">
          按钮
        </mapgis-ui-button>
      </mapgis-ui-config-provider>
      <mapgis-ui-button type="primary">
        按钮
      </mapgis-ui-button>
      <mapgis-ui-button type="link">
        Link
      </mapgis-ui-button>
    </div>
  </template>
  `,
});

export const 基本使用 = Template.bind({});
基本使用.args = {};

const Template1 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiButton },
  data() {
    return {
    };
  },
  methods: {},
  template: `
  <template>
    <div style="margin: 16px 0;font-size: 14px;line-height: 1;font-weight: normal;">
      <mapgis-ui-button-group>
        <mapgis-ui-button>Cancel</mapgis-ui-button>
        <mapgis-ui-button type="primary">
          OK
        </mapgis-ui-button>
      </mapgis-ui-button-group>
      <mapgis-ui-button-group>
        <mapgis-ui-button disabled>
          L
        </mapgis-ui-button>
        <mapgis-ui-button disabled>
          M
        </mapgis-ui-button>
        <mapgis-ui-button disabled>
          R
        </mapgis-ui-button>
      </mapgis-ui-button-group>
      <mapgis-ui-button-group>
        <mapgis-ui-button type="primary">
          L
        </mapgis-ui-button>
        <mapgis-ui-button>M</mapgis-ui-button>
        <mapgis-ui-button>M</mapgis-ui-button>
        <mapgis-ui-button type="dashed">
          R
        </mapgis-ui-button>
      </mapgis-ui-button-group>
    </div>
  </template>
  `,
});

export const 按钮组合 = Template1.bind({});
按钮组合.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTooltipButton },
  data() {
    return {
      svg: Direction,
    };
  },
  methods: {},
  template: `
    <mapgis-ui-tooltip-button v-bind="$props" :icon="svg">
    </mapgis-ui-tooltip-button>
  `,
});

export const 提示按钮 = Template2.bind({});

提示按钮.args = {
  label: "一张图文字",
  zIndex: 2000,
};

提示按钮.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
