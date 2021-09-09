import MapgisUiResult from "../../../ui/src/components/result/Result.vue";

export default {
  title: "界面/反馈/结果",
  component: MapgisUiResult,
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
  components: { MapgisUiResult },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-result
    status="success"
    title="Successfully Purchased Cloud Server ECS!"
    sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
  >
    <template #extra>
      <mapgis-ui-button key="console" type="primary">
        Go Console
      </mapgis-ui-button>
      <mapgis-ui-button key="buy">
        Buy Again
      </mapgis-ui-button>
    </template>
  </mapgis-ui-result>
  `,
});

export const Result = Template.bind({});
Result.args = {};


const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiResult },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <mapgis-ui-button type="primary">
        Back Home
      </mapgis-ui-button>
    </template>
  </mapgis-ui-result>
  `,
});

export const ResultNotFound = Template2.bind({});
ResultNotFound.args = {};
