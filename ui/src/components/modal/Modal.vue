<script>
import Modal from 'ant-design-vue/es/modal';
import buttonTypes from 'ant-design-vue/es/button/buttonTypes';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

function noop() {}
export const modalProps = {
  prefixCls: PropTypes.string,
  /** 对话框是否可见*/
  visible: PropTypes.bool,
  /** 确定按钮 loading*/
  confirmLoading: PropTypes.bool,
  /** 标题*/
  title: PropTypes.any,
  /** 是否显示右上角的关闭按钮*/
  closable: PropTypes.bool,
  closeIcon: PropTypes.any,
  /** 点击确定回调*/
  // onOk: (e: React.MouseEvent<any>) => void,
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
  // onCancel: (e: React.MouseEvent<any>) => void,
  afterClose: PropTypes.func.def(noop),
  /** 垂直居中 */
  centered: PropTypes.bool,
  /** 宽度*/
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** 底部内容*/
  footer: PropTypes.any,
  /** 确认按钮文字*/
  okText: PropTypes.any,
  /** 确认按钮类型*/
  okType: buttonTypes().type,
  /** 取消按钮文字*/
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  /** 点击蒙层是否允许关闭*/
  maskClosable: PropTypes.bool,
  /** 强制渲染 Modal*/
  forceRender: PropTypes.bool,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  destroyOnClose: PropTypes.bool,
  wrapClassName: PropTypes.string,
  maskTransitionName: PropTypes.string,
  transitionName: PropTypes.string,
  getContainer: PropTypes.func,
  zIndex: PropTypes.number,
  bodyStyle: PropTypes.object,
  maskStyle: PropTypes.object,
  mask: PropTypes.bool,
  keyboard: PropTypes.bool,
  wrapProps: PropTypes.object,
  focusTriggerAfterClose: PropTypes.bool,
  dialogStyle: PropTypes.object.def(function () {
    return {};
  })
};
export default {
  name: "mapgis-ui-modal",
  wrapperUI: Modal,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: modalProps,
  methods: {},
  model: {
    prop: 'visible',
    event: 'change'
  },
  computed: {
    uiListeners() {
      let vm = this
      return Object.assign({},
        vm.$listeners,
        {
          'change': function(value) {
            console.warn('进到modal打开的监控中', value)
            vm.$emit('change', value)
          }
        }
      )
    }
  }
};
</script>
