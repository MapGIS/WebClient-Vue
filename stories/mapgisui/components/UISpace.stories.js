import MapgisUiSpace from "../../../ui/src/components/space/Space.vue";
import '../../style/space.css';

export default {
  title: "界面/布局/间隔",
  component: MapgisUiSpace,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSpace },
  data() {
    return {
      value: 0,
    };
  },
  template: `<mapgis-ui-space>
  间隔
  <mapgis-ui-button type="primary">Button</mapgis-ui-button>
  <mapgis-ui-upload>
    <mapgis-ui-button> <mapgis-ui-icon type="upload" /> Click to Upload </mapgis-ui-button>
  </mapgis-ui-upload>
  <mapgis-ui-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
    <mapgis-ui-button>Confirm</mapgis-ui-button>
  </mapgis-ui-popconfirm>
</mapgis-ui-space>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};

const TemplateDirection = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSpace },
  data() {
    return {
      value: 0,
    };
  },
  template: `<mapgis-ui-space direction="vertical">
    <mapgis-ui-card title="Card" style="width: 300px;">
      <p>Card content</p>
      <p>Card content</p>
    </mapgis-ui-card>
    <mapgis-ui-card title="Card" style="width: 300px;">
      <p>Card content</p>
      <p>Card content</p>
    </mapgis-ui-card>
  </mapgis-ui-space>`,
});

export const 垂直间距 = TemplateDirection.bind({});
垂直间距.args = {};

const TemplateCustom = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSpace },
  data() {
    return {
      size: 8,
    };
  },
  template: `<div>
    <mapgis-ui-slider v-model="size" />
    <br />
    <br />
    <mapgis-ui-space :size="size">
      <mapgis-ui-button type="primary">Primary</mapgis-ui-button>
      <mapgis-ui-button>Default</mapgis-ui-button>
      <mapgis-ui-button type="dashed">Dashed</mapgis-ui-button>
      <mapgis-ui-button type="link">Link</mapgis-ui-button>
    </mapgis-ui-space>
  </div>`,
});

export const 自定义间距 = TemplateCustom.bind({});
自定义间距.args = {};

const TemplateFlex = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSpace },
  template: `<div class="space-align-container">
  <div class="space-align-block">
    <mapgis-ui-space align="center">
      center
      <mapgis-ui-button type="primary">Primary</mapgis-ui-button>
      <span class="mock-block">Block</span>
    </mapgis-ui-space>
  </div>
  <div class="space-align-block">
    <mapgis-ui-space align="start">
      start
      <mapgis-ui-button type="primary">Primary</mapgis-ui-button>
      <span class="mock-block">Block</span>
    </mapgis-ui-space>
  </div>
  <div class="space-align-block">
    <mapgis-ui-space align="end">
      end
      <mapgis-ui-button type="primary">Primary</mapgis-ui-button>
      <span class="mock-block">Block</span>
    </mapgis-ui-space>
  </div>
  <div class="space-align-block">
    <mapgis-ui-space align="baseline">
      baseline
      <mapgis-ui-button type="primary">Primary</mapgis-ui-button>
      <span class="mock-block">Block</span>
    </mapgis-ui-space>
  </div>
</div>`,
});

export const 对齐 = TemplateFlex.bind({});
对齐.args = {};
