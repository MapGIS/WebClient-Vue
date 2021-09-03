import MapgisUiRadio from "../../../ui/src/components/radio/Radio.vue";

export default {
  title: "界面/数据输入/单选框",
  component: MapgisUiRadio,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRadio },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-radio>Radio</mapgis-ui-radio>
  `,
});

export const Radio = Template.bind({});
Radio.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRadio },
  data() {
    return {
      value: 'a'
    };
  },
  methods: {
  },
  template: `
  <div>
    <div>
      <mapgis-ui-radio-group v-model="value" button-style="solid">
        <mapgis-ui-radio-button value="a">
          武汉
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="b">
          上海
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="c">
          北京
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="d">
          成都
        </mapgis-ui-radio-button>
      </mapgis-ui-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <mapgis-ui-radio-group default-value="c" button-style="solid">
        <mapgis-ui-radio-button value="a">
          武汉
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="b" disabled>
          上海
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="c">
          北京
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="d">
          成都
        </mapgis-ui-radio-button>
      </mapgis-ui-radio-group>
    </div>
  </div>
  `,
});

export const RadioButtomStyle = Template2.bind({});
RadioButtomStyle.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRadio },
  data() {
    return {
      plainOptions: ['Apple', 'Pear', 'Orange'],
      options: [{
        label: 'Apple',
        value: 'Apple'
      },
      {
        label: 'Pear',
        value: 'Pear'
      },
      {
        label: 'Orange',
        value: 'Orange'
      }
      ],
      optionsWithDisabled: [{
        label: 'Apple',
        value: 'Apple'
      },
      {
        label: 'Pear',
        value: 'Pear'
      },
      {
        label: 'Orange',
        value: 'Orange',
        disabled: false
      }
      ],
      value1: 'Apple',
      value2: 'Apple',
      value3: 'Apple'
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-radio-group :options="plainOptions" :default-value="value1" />
    <br />
    <mapgis-ui-radio-group v-model="value2" :options="options" />
    <br />
    <mapgis-ui-radio-group v-model="value3" :options="optionsWithDisabled" disabled />
  </div>
  `,
});

export const RadioGroup = Template3.bind({});
RadioGroup.args = {};

const Template4 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiRadio },
  data() {
    return {
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-radio-group v-model="value" >
    <mapgis-ui-radio :style="radioStyle" :value="1">
      Option A
    </mapgis-ui-radio>
    <mapgis-ui-radio :style="radioStyle" :value="2">
      Option B
    </mapgis-ui-radio>
    <mapgis-ui-radio :style="radioStyle" :value="3">
      Option C
    </mapgis-ui-radio>
    <mapgis-ui-radio :style="radioStyle" :value="4">
      More...
      <mapgis-ui-input v-if="value === 4" :style="{ width: 100, marginLeft: 10 }" />
    </mapgis-ui-radio>
  </mapgis-ui-radio-group>
  `,
});

export const VerticalRadioGroup = Template4.bind({});
VerticalRadioGroup.args = {};
