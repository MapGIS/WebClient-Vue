import AntdModal from 'ant-design-vue/es/modal';
import Modal from './Modal.vue';

// type ModalInstanceType = typeof Modal;

// interface ModalInstanceConstructor extends ModalInstanceType {
//   info?: Function;
//   success?: Function;
//   error?: Function;
//   warning?: Function;
//   warn?: Function;
//   confirm?: Function;
//   destroyAll?: Function;
// }

const defaultPrefixCls = 'mapgis-ui-modal';
const btnDefaultPrefixCls = 'mapgis-ui-btn';
['info', 'success', 'error', 'warn', 'warning', 'confirm'].forEach((item) => {
  const typeCallback = AntdModal[item];
  Modal[item] = function(config) {
    const { props: okButtonProps = {} } = config.okButtonProps || {};
    const { props: cancelButtonProps = {} } = config.cancelButtonProps || {};
    return typeCallback({
      ...config,
      prefixCls: config.prefixCls || defaultPrefixCls,
      okButtonProps: {
        ...config.okButtonProps,
        props: {
          ...okButtonProps,
          prefixCls: okButtonProps.prefixCls || btnDefaultPrefixCls
        }
      },
      cancelButtonProps: {
        ...config.cancelButtonProps,
        props: {
          ...cancelButtonProps,
          prefixCls: cancelButtonProps.prefixCls || btnDefaultPrefixCls
        }
      }
    });
  };
});

Modal['destroyAll'] = function() {
  return AntdModal['destroyAll']();
};
const ModalInstance = Modal;
export default ModalInstance;
