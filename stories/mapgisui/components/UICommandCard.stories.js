import MapgisUiCommandCard from "../../../ui/src/components/card/CommandCard.vue";
import MarkDown from "../../../ui/docs/api/card/commandcard.md";

export default {
  title: "界面/数据显示/卡片-命令",
  component: MapgisUiCommandCard,
  argTypes: {
    title: "标题",
    tools: [],
    size: "small",
    boxShadow: false,
    bordered: false,
    loading: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCommandCard },
  data() {
    return {};
  },
  methods: {},
  template: `
    <mapgis-ui-command-card v-bind="$props">
      <div>
        卡片内容
        <mapgis-ui-statistic
            title="Feedback"
            :value="11.28"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600' }"
            style="margin-right: 50px"
          >
            <template #prefix>
            </template>
          </mapgis-ui-statistic>
      </div>
    </mapgis-ui-command-card>
  `,
});

export const Card = Template.bind({});
Card.args = {
  title: "标题",
  tools: [
    { title: "工具栏1", icon: "mapgis-huizhi1", method: () => {} },
    { title: "工具栏2", icon: "mapgis-font-colors", method: () => {} },
    { title: "工具栏3", icon: "mapgis-translate", method: () => {} },
  ],
  size: "small",
  boxShadow: false,
  bordered: true,
  loading: false,
};
Card.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
