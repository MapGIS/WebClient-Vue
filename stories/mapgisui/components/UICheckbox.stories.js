import MapgisUiCheckbox from "../../../ui/src/components/checkbox/Checkbox.vue";
import DarkImg from '../assets/images/dark.svg'
import LightImg from '../assets/images/light.svg'
import NightImg from '../assets/images/night.svg'

export default {
  title: "界面/数据输入/多选框",
  component: MapgisUiCheckbox,
  argTypes: {
    groupDisabled: false,
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
  components: { MapgisUiCheckbox },
  data() {
    return {};
  },
  template: `<mapgis-ui-checkbox>Checkbox</mapgis-ui-checkbox>`,
});

export const Checkbox = Template.bind({});
Checkbox.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCheckbox },
  data() {
    return {
      checkedList: ['Apple', 'Orange'],
      indeterminate: true,
      checkAll: false,
      plainOptions: ['Apple', 'Pear', 'Orange']
    };
  },
  methods: {
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    }
  },
  template: `
  <div>
    <div :style="{ borderBottom: '1px solid #E9E9E9' }">
      <mapgis-ui-checkbox :indeterminate="indeterminate" :checked="checkAll" v-on:change="onCheckAllChange">
        Check all
      </mapgis-ui-checkbox>
    </div>
    <br />
    <mapgis-ui-checkbox-group v-model="checkedList" :options="plainOptions" v-on:change="onChange" />
  </div>
  `,
});

export const AllCheckbox = Template2.bind({});
AllCheckbox.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCheckbox },
  data() {
    return {
      plainOptions: ['Apple', 'Pear', 'Orange'],
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' }
      ],
      optionsWithDisabled: [
        { value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false }
      ],
      value: []
    };
  },
  template: `
  <div>
    <mapgis-ui-checkbox-group
      v-model="value"
      name="checkboxgroup"
      :options="plainOptions"
    />
    <br />
    <mapgis-ui-checkbox-group :options="plainOptions" :default-value="['Apple']" />
    <br />
    <mapgis-ui-checkbox-group :options="options" :value="['Pear']" :disabled="groupDisabled"/>
    <br />
    <mapgis-ui-checkbox-group
      :options="optionsWithDisabled"
      :disabled="groupDisabled"
      :default-value="['Apple']"
    >
      <span slot="label" slot-scope="{ value }" style="color: red">{{ value }}</span>
    </mapgis-ui-checkbox-group>
  </div>
  `,
});

export const CheckboxGroup = Template3.bind({});
CheckboxGroup.args = {
  groupDisabled: false
};

const Template4 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCheckbox },
  data() {
    return {
      checked: true,
      disabled: false
    };
  },
  computed: {
    label() {
      const { checked, disabled } = this;
      return `${checked ? 'Checked' : 'Unchecked'}-${disabled ? 'Disabled' : 'Enabled'}`;
    }
  },
  methods: {
    toggleChecked() {
      this.checked = !this.checked;
    },
    toggleDisable() {
      this.disabled = !this.disabled;
    },
    onChange(e) {
      this.checked = e.target.checked;
    }
  },
  template: `
  <div>
    <p :style="{ marginBottom: '20px' }">
      <mapgis-ui-checkbox :checked="checked" :disabled="disabled" v-on:change="onChange">
        {{ label }}
      </mapgis-ui-checkbox>
    </p>
    <p>
      <mapgis-ui-button type="primary" size="small" v-on:click="toggleChecked">
        {{ !checked ? 'Check' : 'Uncheck' }}
      </mapgis-ui-button>
      <mapgis-ui-button :style="{ marginLeft: '10px' }" type="primary" size="small" v-on:click="toggleDisable">
        {{ !disabled ? 'Disable' : 'Enable' }}
      </mapgis-ui-button>
    </p>
  </div>
  `,
});

export const ControledCheckbox = Template4.bind({});
ControledCheckbox.args = {};

const Template5 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCheckbox },
  data() {
    return {
      DarkImg: DarkImg,
      LightImg: LightImg,
      NightImg: NightImg,
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-img-checkbox-group
    >
      <mapgis-ui-img-checkbox title="暗色菜单风格" :img="DarkImg" value="dark" />
      <mapgis-ui-img-checkbox title="亮色菜单风格" :img="LightImg" value="light" />
      <mapgis-ui-img-checkbox title="暗黑模式" :img="NightImg" value="night" />
    </mapgis-ui-img-checkbox-group>
  </div>
  `,
});

export const 图片选择 = Template5.bind({});
图片选择.args = {};

const Template6 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCheckbox },
  data() {
    return {
      palettes: [
        '#f5222d',
        '#fa541c',
        '#fadb14',
        '#3eaf7c',
        '#13c2c2',
        '#1890ff',
        '#722ed1',
        '#eb2f96'
      ]
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-color-checkbox-group
    >
      <mapgis-ui-color-checkbox
        v-for="(color, index) in palettes"
        :key="index"
        :color="color"
        :value="index"
      />
    </mapgis-ui-color-checkbox-group>
  </div>
  `,
});

export const 颜色选择 = Template6.bind({});
颜色选择.args = {};
