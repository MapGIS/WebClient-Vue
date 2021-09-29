import MapgisUiForm from "../../../ui/src/components/form/Form.vue";

export default {
  title: "界面/数据输入/表单",
  component: MapgisUiForm,
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
  components: { MapgisUiForm },
  template: `
    <mapgis-ui-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <mapgis-ui-form-item label="Note">
        <mapgis-ui-input
          v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="Gender">
        <mapgis-ui-select
          v-decorator="[
            'gender',
            { rules: [{ required: true, message: 'Please select your gender!' }] },
          ]"
          placeholder="Select a option and change input text above"
          @change="handleSelectChange"
        >
          <mapgis-ui-select-option value="male">
            male
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="female">
            female
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <mapgis-ui-button type="primary" html-type="submit">
          Submit
        </mapgis-ui-button>
      </mapgis-ui-form-item>
    </mapgis-ui-form>
  `,
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      });
    },
  },
});

export const 表单联动 = Template.bind({});
表单联动.args = {};

const Template1 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiForm },
  template: `
  <mapgis-ui-form-model :layout="form.layout" :model="form" v-bind="formItemLayout">
    <mapgis-ui-form-model-item label="Form Layout">
      <mapgis-ui-radio-group v-model="form.layout">
        <mapgis-ui-radio-button value="horizontal">
          Horizontal
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="vertical">
          Vertical
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="inline">
          Inline
        </mapgis-ui-radio-button>
      </mapgis-ui-radio-group>
    </mapgis-ui-form-model-item>
    <mapgis-ui-form-model-item label="Field A">
      <mapgis-ui-input v-model="form.fieldA" placeholder="input placeholder" />
    </mapgis-ui-form-model-item>
    <mapgis-ui-form-model-item label="Field B">
      <mapgis-ui-input v-model="form.fieldB" placeholder="input placeholder" />
    </mapgis-ui-form-model-item>
    <mapgis-ui-form-model-item :wrapper-col="buttonItemLayout.wrapperCol">
      <mapgis-ui-button type="primary">
        Submit
      </mapgis-ui-button>
    </mapgis-ui-form-model-item>
  </mapgis-ui-form-model>
  `,
  data() {
    return {
      form: {
        layout: 'horizontal',
        fieldA: '',
        fieldB: '',
      },
    };
  },
  computed: {
    formItemLayout() {
      const { layout } = this.form;
      return layout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : {};
    },
    buttonItemLayout() {
      const { layout } = this.form;
      return layout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : {};
    },
  },
  methods: {
  },
});

export const 表单布局 = Template1.bind({});
表单布局.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiForm },
  template: `
  <mapgis-ui-setting-form :label-width="172" :label-col="labelCol" :wrapper-col="wrapperCol" :layout="'horizontal'">
    <mapgis-ui-form-item label="剖面颜色">
      <mapgis-ui-sketch-color-picker
        :color.sync="color"
        :disableAlpha="false"
      ></mapgis-ui-sketch-color-picker>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="动画时间">
      <mapgis-ui-input-number v-model="time" :min="0" />
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="剖切距离">
      <mapgis-ui-slider
        v-model="distance"
        :min="min"
        :max="max"
        :disabled="false"
      />
    </mapgis-ui-form-item>
  </mapgis-ui-setting-form>
  `,
  data() {
    return {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      // value: 0,
      color: 'rgb(200,200,200,0.5)',
      time: 10,
      max: 10000,
      min: -10000,
      distance: 0,
    };
  },
  computed: {
    formItemLayout() {
      const { layout } = this.form;
      return layout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : {};
    },
    buttonItemLayout() {
      const { layout } = this.form;
      return layout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : {};
    },
  },
  methods: {
  },
});

export const settingForm = Template2.bind({});
settingForm.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {},
  template: `
  <div>
    <mapgis-ui-form-custom-validate :validate-status="validateStatus" :help="help">
      <mapgis-ui-input v-model="value" placeholder="请输入"/>
    </mapgis-ui-form-custom-validate>
    <mapgis-ui-form-custom-validate :validate-status="validateStatus" :help="help">
      <mapgis-ui-select default-value="武汉">
        <mapgis-ui-select-opt-group>
          <span slot="label">湖北省</span>
          <mapgis-ui-select-option value="黄冈">
            黄冈
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="武汉">
            武汉
          </mapgis-ui-select-option>
        </mapgis-ui-select-opt-group>
        <mapgis-ui-select-opt-group label="浙江省">
          <mapgis-ui-select-option value="杭州">
            杭州
          </mapgis-ui-select-option>
        </mapgis-ui-select-opt-group>
      </mapgis-ui-select>
    </mapgis-ui-form-custom-validate>
    <mapgis-ui-button @click="handleClick">切换</mapgis-ui-button>
  </div>
  `,
  data() {
    return {
      validateStatus: 'error',
      help: '错误',
      value: '点击按钮切换状态'
    };
  },
  computed: {
  },
  methods: {
    handleClick () {
      this.validateStatus = this.validateStatus === 'warning' ? 'success' : 'warning' ,
      this.help = this.validateStatus === 'warning' ? '警告' : '成功'
      this.value = '状态已切换'
    }
  },
});

export const 自定义校验 = Template3.bind({});
自定义校验.args = {};
