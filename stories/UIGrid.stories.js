import MapgisUiRow from "../ui/src/components/grid/Row.vue";
import MapgisUiCol from "../ui/src/components/grid/Col.vue";

import './style/grid.css';

export default {
  title: "界面/网格",
  component: MapgisUiRow,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRow, MapgisUiCol },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div>
    <mapgis-ui-row>
      <mapgis-ui-col :span="12" class="test-grid-col">
        col-12
      </mapgis-ui-col>
      <mapgis-ui-col :span="12" class="test-grid-col">
        col-12
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-col :span="8" class="test-grid-col">
        col-8
      </mapgis-ui-col>
      <mapgis-ui-col :span="8" class="test-grid-col">
        col-8
      </mapgis-ui-col>
      <mapgis-ui-col :span="8" class="test-grid-col">
        col-8
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-col :span="6" class="test-grid-col">
        col-6
      </mapgis-ui-col>
      <mapgis-ui-col :span="6" class="test-grid-col">
        col-6
      </mapgis-ui-col>
      <mapgis-ui-col :span="6" class="test-grid-col">
        col-6
      </mapgis-ui-col>
      <mapgis-ui-col :span="6" class="test-grid-col">
        col-6
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};

const TemplateFlex = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRow, MapgisUiCol },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div>
    <p>顶部对齐</p>
    <mapgis-ui-row type="flex" justify="center" align="top">
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-100">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-50">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-120">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-80">
          col-4
        </p>
      </mapgis-ui-col>
    </mapgis-ui-row>

    <p>中心对齐</p>
    <mapgis-ui-row type="flex" justify="space-around" align="middle">
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-100">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-50">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-120">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-80">
          col-4
        </p>
      </mapgis-ui-col>
    </mapgis-ui-row>

    <p>底部对齐</p>
    <mapgis-ui-row type="flex" justify="space-between" align="bottom">
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-100">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-50">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-120">
          col-4
        </p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" class="test-grid-col">
        <p class="height-80">
          col-4
        </p>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>`,
});

export const Flex对齐 = TemplateFlex.bind({});
Flex对齐.args = {};
