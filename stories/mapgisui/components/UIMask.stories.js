import MapgisUiMask from "../../../ui/src/components/mask/Mask.vue";

export default {
  title: "界面/反馈/遮罩层",
  component: MapgisUiMask,
  argTypes: {
    parentDivClass: { table: { disable: true } },
    loading: { table: { disable: true } },
    percent: { table: { disable: true } },
    text: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiMask },
  data() {
    return {
      maskShow: false
    };
  },
  methods: {
    handleCheckout () {
      this.maskShow = !this.maskShow
    }
  },
  template: `
  <div>
  <span @click="handleCheckout">点击切换状态</span>
  <mapgis-ui-card class="mapgis-ui-map-container" style="height:300px;">
  </mapgis-ui-card>
  <mapgis-ui-mask
    :parentDivClass="'mapgis-ui-map-container'"
    :loading="maskShow"
    :text="maskText"
  />
  </div>
  `,
});

export const 遮罩层 = Template.bind({});
遮罩层.args = {
  // maskShow: true,
  maskText: '加载中...'
};
