import MapgisUiUpload from "../../../ui/src/components/upload/Upload.vue";
import '../../style/space.css';

export default {
  title: "界面/通用/SVG编辑器",
  component: MapgisUiUpload,
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
  components: { MapgisUiUpload },
  data() {
    return {
      symbolData: [],
      symbolUrl: "http://localhost:8895/SVGManager.json",
    };
  },
  methods: {
  },
  mounted() {

  },
  template: `
  <div>
  <mapgis-ui-svg-manager
      :symbolUrl="symbolUrl"
  ></mapgis-ui-svg-manager>
  </div>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};