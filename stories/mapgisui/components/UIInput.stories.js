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
      value: 3,
      leftRad: 123,
      userName: 321
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
    <mapgis-ui-input-number-addon id="inputNumberAddon" addon-before="左" addon-after="右" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    
    ————————————————————————单元测试————————————————————————
    <mapgis-ui-input-number-addon v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-before="左置" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-after="右置" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon prefix="￥" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-before="左置" addon-after="右置" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-before="左置" prefix="￥" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
      <mapgis-ui-input-number-addon addon-before="左置" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
      <mapgis-ui-input-number-addon addon-after="右置" prefix="￥" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-after="右置" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon prefix="￥" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
      <mapgis-ui-input-number-addon addon-after="右置" prefix="￥" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
      <mapgis-ui-input-number-addon addon-before="左置" prefix="￥" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-before="左置" addon-after="右置" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-before="左置" addon-after="右置" prefix="￥" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    <mapgis-ui-input-number-addon addon-before="左置" addon-after="右置" prefix="￥" suffix="元" v-model="value" autoWidth :min="3" :max="5" @change="onChange" />
    
    ————————————————————————分隔线————————————————————————
    <mapgis-ui-input-number-addon ref="userNameInput" v-model="userName" placeholder="Basic usage">
      <mapgis-ui-iconfont slot="addonAfter" type="mapgis-yuanzhui" />
      <mapgis-ui-iconfont slot="addonBefore" type="mapgis-vector" style="color: rgba(0,0,0,.45)" />
      <mapgis-ui-iconfont slot="prefix" type="mapgis-yuanzhui" />
      <template #suffix>
        <mapgis-ui-tooltip title="额外123信息">
          <mapgis-ui-iconfont type="mapgis-vector" style="color: rgba(0,0,0,.45)" />
        </mapgis-ui-tooltip>
      </template>	
    </mapgis-ui-input-number-addon>
  </div>
  `,
});

export const InputNumber带前后置或前后缀 = Template6.bind({});
InputNumber带前后置或前后缀.args = {};