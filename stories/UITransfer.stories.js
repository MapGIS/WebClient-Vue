import MapgisUiTransfer from "../ui/src/components/transfer/Transfer.vue";

export default {
  title: "界面/穿梭框",
  component: MapgisUiTransfer,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTransfer },
  data() {
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1
      });
    }
    const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);
    return {
      mockData,
      targetKeys: oriTargetKeys,
      selectedKeys: ['1', '4'],
      disabled: false
    };
  },
  methods: {
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys;
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    },
    handleDisable(disabled) {
      this.disabled = disabled;
    }
  },
  template: `
  <div>
    <mapgis-ui-transfer
      :data-source="mockData"
      :titles="['Source', 'Target']"
      :target-keys="targetKeys"
      :selected-keys="selectedKeys"
      :render="item => item.title"
      :disabled="disabled"
      v-on:change="handleChange"
      v-on:selectChange="handleSelectChange"
    />
    <mapgis-ui-switch
      un-checked-children="enabled"
      checked-children="disabled"
      :checked="disabled"
      style="margin-top: 16px"
      v-on:change="handleDisable"
    />
  </div>
  `,
});

export const Transfer = Template.bind({});
Transfer.args = {};
