import MapgisUiInput from "../../../ui/src/components/input/Input.vue";

export default {
  title: "界面/数据输入/输入框",
  component: MapgisUiInput,
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
  components: { MapgisUiInput },
  data() {
    return {
      value: ''
    };
  },
  methods: {
  },
  template: `
  <div>
    <p>[{{value}}]</p>
    <mapgis-ui-input autoWidth v-model="value" placeholder="Basic input"></mapgis-ui-input>
    <br />
    <br />
    <mapgis-ui-input-group compact>
      <mapgis-ui-input style="width: 20%" default-value="0571" />
      <mapgis-ui-input style="width: 30%" default-value="26888888" />
    </mapgis-ui-input-group>
  </div>
  `,
});

export const Input = Template.bind({});
Input.args = {};


const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiInput },
  data() {
    return {
      value: ''
    };
  },
  methods: {
  },
  template: `
  <div class="components-input-demo-presuffix">
    <mapgis-ui-input prefix="￥" suffix="RMB" />
  </div>
  `,
});

export const PrefixInput = Template2.bind({});
PrefixInput.args = {};


const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiInput },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-input-search autoWidth placeholder="input search loading deault" loading />
    <br />
    <br />
    <mapgis-ui-input-search placeholder="input search loading with enterButton" loading enter-button />
  </div>
  `,
});

export const SearchInput = Template3.bind({});
SearchInput.args = {};

const Template4 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiInput },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-textarea placeholder="Autosize height based on content lines" auto-size />
    <div style="margin: 24px 0" />
    <mapgis-ui-textarea
      placeholder="Autosize height with minimum and maximum number of lines"
      :auto-size="{ minRows: 2, maxRows: 6 }"
    />
    <div style="margin: 24px 0" />
    <mapgis-ui-textarea
      placeholder="Controlled autosize"
      :auto-size="{ minRows: 3, maxRows: 5 }"
    />
  </div>
  `,
});

export const TextareaInput = Template4.bind({});
TextareaInput.args = {};

const Template5 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiInput },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-input-password placeholder="input password" />
  `,
});

export const PasswordInput = Template5.bind({});
PasswordInput.args = {};

const Template6 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiInput },
  data() {
    return {
      value: 3
    };
  },
  methods: {
    onChange(value) {
      console.log('changed', value);
    },
  },
  template: `
  <div>
    <mapgis-ui-input-number id="inputNumber" autoWidth v-model="value" :min="1" :max="10" @change="onChange" />
    当前值：{{ value }}
  </div>
  `,
});

export const InputNumber = Template6.bind({});
InputNumber.args = {};