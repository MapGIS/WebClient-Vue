import {setTheme} from "../../../ui/src/util/style/theme/set-theme";
import MapgisUiSelectPanel from "../../../ui/src/layout/panel/SelectPanel.vue";
import Markdown from "../../../ui/docs/api/panel/select.md";

export default {
    title: "界面/Pro/面板/选择器面板",
    component: MapgisUiSelectPanel,
    argTypes: {},
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisUiSelectPanel},
    mounted() {
        // setTheme("technology");
    },
    template: `
      <div>
      <mapgis-ui-select-panel
          v-bind="$props"
          @change="onEmitterChange">
      </mapgis-ui-select-panel>
      <mapgis-ui-select-panel
          v-bind="$props"
          :labelCol="12" :wrapperCol="12"
          @change="onEmitterChange">
      </mapgis-ui-select-panel>
      </div>`,
    methods: {
        onEmitterChange(e) {
            console.log("选中值：", e);
        }
    }
});

export const 选择器面板 = Template.bind({});
选择器面板.args = {
    selectOptions: ["盒状放射", "圆形放射", "锥形放射", "球形放射"],
    value:"盒状放射",
    label:"发射类型"
};

选择器面板.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};
