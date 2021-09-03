import MapgisUiCascader from "../../../ui/src/components/cascader/Cascader.vue";

export default {
  title: "界面/数据输入/级联选择",
  component: MapgisUiCascader,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCascader },
  data() {
    return {
      options: [
        {
          value: '湖北',
          label: '湖北',
          children: [
            {
              value: '武汉',
              label: '武汉',
              children: [
                {
                  value: '东湖',
                  label: '东湖',
                },
                {
                  value: '黄鹤楼',
                  label: '黄鹤楼',
                },
              ],
            },
          ],
        },
        {
          value: '江苏',
          label: '江苏',
          children: [
            {
              value: '南京',
              label: '南京',
              children: [
                {
                  value: '中华门',
                  label: '中华门',
                },
              ],
            },
          ],
        },
      ]
    };
  },
  methods: {
    onChange(value) {
      this.$message.info('当前选择：' + value);
    },
  },
  template: `<mapgis-ui-cascader style="width: 400px;" :options="options" placeholder="请选择" @change="onChange" />`,
});

export const Cascader = Template.bind({});
Cascader.args = {};
