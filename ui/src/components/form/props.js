export const formProps = {
  form: {
    type: Object
  },
  compact: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'mini'
  },
  hideRequiredMark: {
    type: Boolean,
    default: false
  },
  labelAlign: {
    type: String,
    default: 'left',
    validator: v => ['left', 'right'].includes(v)
  },
  wrapperAlign: {
    type: String,
    default: 'right',
    validator: v => ['left', 'right'].includes(v)
  },
  layout: {
    type: String,
    default: 'horizontal',
    validator: v => ['horizontal', 'vertical', 'inline'].includes(v)
  },
  itemLayout: {
    type: String,
    default: 'fixed',
    validator: v => ['grid', 'fixed'].includes(v)
  },
  labelCol: {
    type: Object,
    default() {
      return { span: 8 }
    }
  },
  wrapperCol: {
    type: Object,
    default() {
      return { span: 16 }
    }
  },
  labelWidth: {
    type: Number,
    default: 90
  },
  wrapperWidth: {
    type: Number | String,
    default: 170
  },
  selfUpdate: {
    type: Boolean,
    default: false
  },
  colon: {
    type: Boolean,
    default: false
  },
  noLastMarginBottom: {
    type: Boolean,
    default: false
  }
}
