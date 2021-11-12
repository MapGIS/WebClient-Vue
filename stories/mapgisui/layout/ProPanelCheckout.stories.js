import { setTheme } from "../../../ui/src/util/style/theme/set-theme";
import MapgisUiSwitchPanel from "../../../ui/src/layout/panel/SwitchPanel.vue";

export default {
  title: "界面/Pro/面板/开关面板",
  component: MapgisUiSwitchPanel,
  argTypes: {
    layout: "vertical",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSwitchPanel },
  data() {
    return {
      value: 0,
      cloudsduration: 0,
      cloudsduration: 0,
    };
  },
  mounted() {
    setTheme("technology");
  },
  template: `<div>
  <mapgis-ui-border type="border1" :style="{width: '280px', height:'300px'}">
    <mapgis-ui-switch-panel layout="horizontal">
        <mapgis-ui-form-model-item label="周期/秒">
          <mapgis-ui-space>
          <mapgis-ui-slider
          v-model="cloudsduration"
          :style="{width: '70px'}"
          :max="10"
          :min="1"
        />
        <mapgis-ui-input-number
            v-model="cloudsduration"
            :max="10"
            :min="1"
            size="small"
        />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>        
      </mapgis-ui-switch-panel>
      <mapgis-ui-switch-panel layout="vertical">
        <mapgis-ui-form-model-item label="周期/秒">
          <mapgis-ui-row>
          <mapgis-ui-col :span="14">
            <mapgis-ui-slider
              v-model="cloudsduration"
              :max="10"
              :min="1"
            />
            </mapgis-ui-col>
            <mapgis-ui-col :span="9" :offset="1">
            <mapgis-ui-input-number
                v-model="cloudsduration"
                :max="10"
                :min="1"
                size="small"
            />
            </mapgis-ui-col>
            </mapgis-ui-row>
        </mapgis-ui-form-model-item>        
      </mapgis-ui-switch-panel>
    </mapgis-ui-border>
  </div>`,
});

export const 开关面板 = Template.bind({});
开关面板.args = {};
