 import MapgisUiMentions from "../../../ui/src/components/mentions/Mentions.vue";

export default {
  title: "界面/数据输入/提及",
  component: MapgisUiMentions,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiMentions },
  data() {
    return {
      value: '@mapgis.com',
    };
  },
  methods: {
    onSelect(option) {
      console.log('select', option);
    },
    onChange(value) {
      console.log('Change:', value);
    },
  },
  template: `
  <mapgis-ui-mentions v-model="value" @change="onChange" @select="onSelect">
    <mapgis-ui-mentions-option value="mapgis.com">
      mapgis.com
    </mapgis-ui-mentions-option>
    <mapgis-ui-mentions-option value="163.com">
      163.com
    </mapgis-ui-mentions-option>
    <mapgis-ui-mentions-option value="qq.com">
      qq.com
    </mapgis-ui-mentions-option>
  </mapgis-ui-mentions>
  `,
});

export const Mentions = Template.bind({});
Mentions.args = {};
